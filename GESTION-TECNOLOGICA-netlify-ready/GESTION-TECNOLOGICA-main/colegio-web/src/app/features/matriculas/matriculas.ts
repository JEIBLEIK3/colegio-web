import { Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { CursosService } from '../../core/services/cursos.service';
import { Estudiante } from '../../core/models/models';
import { MatriculaFormDialog } from './matricula-form-dialog/matricula-form-dialog';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule, MatTooltipModule
  ],
  templateUrl: './matriculas.html',
  styleUrl: './matriculas.scss'
})
export class Matriculas {
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly cursosService = inject(CursosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly cursos = this.cursosService.items;
  readonly cargando = this.estudiantesService.loading;

  readonly filtroCurso = signal<string>('todos');
  readonly filtroEstado = signal<string>('todos');
  readonly filtroTexto = signal<string>('');

  readonly columnas = ['estudiante', 'documento', 'curso', 'acudiente', 'estado', 'acciones'];

  readonly estudiantesFiltrados = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    return this.estudiantesService.items().filter(e => {
      const coincideCurso = this.filtroCurso() === 'todos' || e.cursoId === this.filtroCurso();
      const coincideEstado = this.filtroEstado() === 'todos' || e.estadoMatricula === this.filtroEstado();
      const coincideTexto = !texto || `${e.nombres} ${e.apellidos} ${e.documento}`.toLowerCase().includes(texto);
      return coincideCurso && coincideEstado && coincideTexto;
    });
  });

  nombreCurso(cursoId: string): string {
    return this.cursos().find(c => c.id === cursoId)?.nombre ?? '—';
  }

  claseChip(estado: string): string {
    return 'chip-' + estado.toLowerCase();
  }

  abrirFormulario(estudiante: Estudiante | null): void {
    const ref = this.dialog.open(MatriculaFormDialog, {
      data: { estudiante, cursos: this.cursos() },
      width: '720px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;

      if (estudiante) {
        this.estudiantesService.update(estudiante.id, resultado).subscribe(() =>
          this.snackBar.open('Matrícula actualizada', 'Cerrar', { duration: 2500 })
        );
      } else {
        const nuevo: Estudiante = {
          ...resultado,
          id: 'e-' + crypto.randomUUID().slice(0, 8),
          fechaMatricula: new Date().toISOString().slice(0, 10),
          anioLectivo: new Date().getFullYear().toString()
        };
        this.estudiantesService.create(nuevo).subscribe(() =>
          this.snackBar.open('Estudiante matriculado correctamente', 'Cerrar', { duration: 2500 })
        );
      }
    });
  }

  eliminar(estudiante: Estudiante): void {
    if (!confirm(`¿Retirar la matrícula de ${estudiante.nombres} ${estudiante.apellidos}?`)) return;
    this.estudiantesService.update(estudiante.id, { estadoMatricula: 'Retirada' }).subscribe(() =>
      this.snackBar.open('Matrícula marcada como retirada', 'Cerrar', { duration: 2500 })
    );
  }
}
