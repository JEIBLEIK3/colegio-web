import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ObservacionesService } from '../../core/services/observaciones.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { CursosService } from '../../core/services/cursos.service';
import { AuthService } from '../../core/auth/auth.service';
import { Observacion } from '../../core/models/models';
import { ObservacionFormDialog } from './observacion-form-dialog/observacion-form-dialog';

@Component({
  selector: 'app-observaciones',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule
  ],
  templateUrl: './observaciones.html',
  styleUrl: './observaciones.scss'
})
export class Observaciones {
  private readonly observacionesService = inject(ObservacionesService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly cursosService = inject(CursosService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly cursosVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    if (rol === 'admin') return this.cursosService.items();
    const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
    return this.cursosService.items().filter(c => prof?.cursosAsignados.includes(c.id));
  });

  readonly filtroCurso = signal<string>('todos');

  readonly estudiantesDisponibles = computed(() => {
    const curso = this.filtroCurso();
    const visibles = this.cursosVisibles().map(c => c.id);
    return this.estudiantesService.items().filter(
      e => e.estadoMatricula === 'Activa' && (curso === 'todos' ? visibles.includes(e.cursoId) : e.cursoId === curso)
    );
  });

  readonly observacionesFiltradas = computed(() => {
    const ids = new Set(this.estudiantesDisponibles().map(e => e.id));
    return this.observacionesService.items()
      .filter(o => ids.has(o.estudianteId))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  });

  nombreEstudiante(id: string): string {
    const e = this.estudiantesService.items().find(x => x.id === id);
    return e ? `${e.nombres} ${e.apellidos}` : '—';
  }

  claseChip(tipo: string): string {
    return 'chip-' + tipo.toLowerCase();
  }

  agregarObservacion(): void {
    const ref = this.dialog.open(ObservacionFormDialog, {
      data: { estudiantes: this.estudiantesDisponibles() },
      width: '600px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      const usuario = this.auth.usuario();
      const estudiante = this.estudiantesService.items().find(e => e.id === resultado.estudianteId);
      const nueva: Observacion = {
        id: 'o-' + crypto.randomUUID().slice(0, 8),
        ...resultado,
        cursoId: estudiante?.cursoId ?? '',
        fecha: new Date().toISOString().slice(0, 10),
        registradoPor: usuario?.refId ?? usuario?.id ?? ''
      };
      this.observacionesService.create(nueva).subscribe(() =>
        this.snackBar.open('Observación registrada', 'Cerrar', { duration: 2500 })
      );
    });
  }

  eliminar(observacion: Observacion): void {
    if (!confirm('¿Eliminar esta observación?')) return;
    this.observacionesService.remove(observacion.id).subscribe(() =>
      this.snackBar.open('Observación eliminada', 'Cerrar', { duration: 2500 })
    );
  }
}
