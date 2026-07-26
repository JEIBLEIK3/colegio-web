import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HorariosService } from '../../core/services/horarios.service';
import { CursosService } from '../../core/services/cursos.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { AuthService } from '../../core/auth/auth.service';
import { BloqueHorario, DiaSemana } from '../../core/models/models';
import { HorarioFormDialog } from './horario-form-dialog/horario-form-dialog';

const DIAS: DiaSemana[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatTooltipModule],
  templateUrl: './horarios.html',
  styleUrl: './horarios.scss'
})
export class Horarios {
  private readonly horariosService = inject(HorariosService);
  private readonly cursosService = inject(CursosService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly dias = DIAS;
  readonly rol = this.auth.rol;
  readonly esAdmin = computed(() => this.rol() === 'admin');

  readonly cursosVisibles = computed(() => {
    const rol = this.rol();
    const usuario = this.auth.usuario();
    if (rol === 'admin') return this.cursosService.items();
    if (rol === 'profesor') {
      const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
      return this.cursosService.items().filter(c => prof?.cursosAsignados.includes(c.id));
    }
    if (rol === 'estudiante') {
      const est = this.estudiantesService.items().find(e => e.id === usuario?.refId);
      return this.cursosService.items().filter(c => c.id === est?.cursoId);
    }
    return [];
  });

  readonly cursoSeleccionado = signal<string>('');

  constructor() {
    effect(() => {
      const visibles = this.cursosVisibles();
      if (!this.cursoSeleccionado() && visibles.length > 0) {
        this.cursoSeleccionado.set(visibles[0].id);
      }
    });
  }

  readonly bloquesPorDia = computed(() => {
    const cursoId = this.cursoSeleccionado();
    const bloques = this.horariosService.items().filter(b => b.cursoId === cursoId);
    const mapa = new Map<DiaSemana, BloqueHorario[]>();
    for (const dia of DIAS) {
      mapa.set(dia, bloques.filter(b => b.dia === dia).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)));
    }
    return mapa;
  });

  nombreProfesor(id: string): string {
    const p = this.profesoresService.items().find(x => x.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : '—';
  }

  agregarBloque(): void {
    const ref = this.dialog.open(HorarioFormDialog, {
      data: { cursoId: this.cursoSeleccionado(), profesores: this.profesoresService.items() },
      width: '600px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      const nuevo: BloqueHorario = { ...resultado, id: 'h-' + crypto.randomUUID().slice(0, 8) };
      this.horariosService.create(nuevo).subscribe(() =>
        this.snackBar.open('Bloque de horario agregado', 'Cerrar', { duration: 2500 })
      );
    });
  }

  eliminarBloque(bloque: BloqueHorario): void {
    if (!confirm(`¿Eliminar ${bloque.asignatura} (${bloque.dia} ${bloque.horaInicio})?`)) return;
    this.horariosService.remove(bloque.id).subscribe(() =>
      this.snackBar.open('Bloque eliminado', 'Cerrar', { duration: 2500 })
    );
  }
}
