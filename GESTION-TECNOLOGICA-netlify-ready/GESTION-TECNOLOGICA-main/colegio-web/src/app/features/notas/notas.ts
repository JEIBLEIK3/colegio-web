import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotasService } from '../../core/services/notas.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { CursosService } from '../../core/services/cursos.service';
import { AuthService } from '../../core/auth/auth.service';
import { Nota } from '../../core/models/models';
import { NotaFormDialog } from './nota-form-dialog/nota-form-dialog';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatChipsModule, MatTooltipModule
  ],
  templateUrl: './notas.html',
  styleUrl: './notas.scss'
})
export class Notas {
  private readonly notasService = inject(NotasService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly cursosService = inject(CursosService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly periodos = [1, 2, 3, 4] as const;
  readonly esEstudiante = computed(() => this.auth.rol() === 'estudiante');

  readonly cursosVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    if (rol === 'admin') return this.cursosService.items();
    if (rol === 'profesor') {
      const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
      return this.cursosService.items().filter(c => prof?.cursosAsignados.includes(c.id));
    }
    const est = this.estudiantesService.items().find(e => e.id === usuario?.refId);
    return this.cursosService.items().filter(c => c.id === est?.cursoId);
  });

  readonly asignaturasVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    if (rol === 'profesor') {
      const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
      return prof?.asignaturas ?? [];
    }
    const cursoId = this.cursoSeleccionado();
    const asignaturas = new Set(
      this.profesoresService.items()
        .filter(p => p.cursosAsignados.includes(cursoId))
        .flatMap(p => p.asignaturas)
    );
    return Array.from(asignaturas);
  });

  readonly cursoSeleccionado = signal<string>('');
  readonly asignaturaSeleccionada = signal<string>('');
  readonly periodoSeleccionado = signal<1 | 2 | 3 | 4>(1);

  constructor() {
    effect(() => {
      const visibles = this.cursosVisibles();
      if (!this.cursoSeleccionado() && visibles.length > 0) {
        this.cursoSeleccionado.set(visibles[0].id);
      }
    });
    effect(() => {
      const asignaturas = this.asignaturasVisibles();
      if (!this.asignaturaSeleccionada() && asignaturas.length > 0) {
        this.asignaturaSeleccionada.set(asignaturas[0]);
      }
    });
  }

  readonly filasEstudiantes = computed(() => {
    const cursoId = this.cursoSeleccionado();
    const asignatura = this.asignaturaSeleccionada();
    const periodo = this.periodoSeleccionado();
    const usuario = this.auth.usuario();

    let estudiantes = this.estudiantesService.items().filter(e => e.cursoId === cursoId && e.estadoMatricula === 'Activa');
    if (this.esEstudiante()) {
      estudiantes = estudiantes.filter(e => e.id === usuario?.refId);
    }

    return estudiantes.map(e => {
      const notas = this.notasService.items().filter(
        n => n.estudianteId === e.id && n.asignatura === asignatura && n.periodo === periodo
      );
      const sumaPesos = notas.reduce((s, n) => s + n.porcentaje, 0);
      const promedio = sumaPesos > 0
        ? notas.reduce((s, n) => s + n.valor * n.porcentaje, 0) / sumaPesos
        : null;
      return { estudiante: e, notas, promedio };
    });
  });

  agregarNota(estudianteId: string, estudianteNombre: string): void {
    const ref = this.dialog.open(NotaFormDialog, {
      data: { estudianteNombre, asignatura: this.asignaturaSeleccionada(), periodo: this.periodoSeleccionado() },
      width: '500px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;
      const usuario = this.auth.usuario();
      const nueva: Nota = {
        id: 'n-' + crypto.randomUUID().slice(0, 8),
        estudianteId,
        cursoId: this.cursoSeleccionado(),
        asignatura: this.asignaturaSeleccionada(),
        periodo: this.periodoSeleccionado(),
        descripcion: resultado.descripcion,
        valor: resultado.valor,
        porcentaje: resultado.porcentaje,
        fecha: new Date().toISOString().slice(0, 10),
        registradoPor: usuario?.refId ?? usuario?.id ?? ''
      };
      this.notasService.create(nueva).subscribe(() =>
        this.snackBar.open('Nota registrada', 'Cerrar', { duration: 2500 })
      );
    });
  }

  eliminarNota(nota: Nota): void {
    if (!confirm(`¿Eliminar la nota "${nota.descripcion}"?`)) return;
    this.notasService.remove(nota.id).subscribe(() =>
      this.snackBar.open('Nota eliminada', 'Cerrar', { duration: 2500 })
    );
  }
}
