import { Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfesoresService } from '../../core/services/profesores.service';
import { CursosService } from '../../core/services/cursos.service';
import { Profesor } from '../../core/models/models';
import { ProfesorFormDialog } from './profesor-form-dialog/profesor-form-dialog';

@Component({
  selector: 'app-profesores',
  standalone: true,
  imports: [
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule
  ],
  templateUrl: './profesores.html',
  styleUrl: './profesores.scss'
})
export class Profesores {
  private readonly profesoresService = inject(ProfesoresService);
  private readonly cursosService = inject(CursosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly cursos = this.cursosService.items;
  readonly cargando = this.profesoresService.loading;
  readonly filtroTexto = signal('');

  readonly columnas = ['nombre', 'especialidad', 'asignaturas', 'cursos', 'contacto', 'estado', 'acciones'];

  readonly profesoresFiltrados = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    return this.profesoresService.items().filter(p =>
      !texto || `${p.nombres} ${p.apellidos} ${p.especialidad}`.toLowerCase().includes(texto)
    );
  });

  nombresCursos(ids: string[]): string {
    return ids.map(id => this.cursos().find(c => c.id === id)?.nombre).filter(Boolean).join(', ') || '—';
  }

  abrirFormulario(profesor: Profesor | null): void {
    const ref = this.dialog.open(ProfesorFormDialog, {
      data: { profesor, cursos: this.cursos() },
      width: '720px',
      maxWidth: '95vw'
    });

    ref.afterClosed().subscribe(resultado => {
      if (!resultado) return;

      if (profesor) {
        this.profesoresService.update(profesor.id, resultado).subscribe(() =>
          this.snackBar.open('Profesor actualizado', 'Cerrar', { duration: 2500 })
        );
      } else {
        const nuevo: Profesor = { ...resultado, id: 'p-' + crypto.randomUUID().slice(0, 8) };
        this.profesoresService.create(nuevo).subscribe(() =>
          this.snackBar.open('Profesor registrado', 'Cerrar', { duration: 2500 })
        );
      }
    });
  }

  eliminar(profesor: Profesor): void {
    if (!confirm(`¿Desactivar a ${profesor.nombres} ${profesor.apellidos}?`)) return;
    this.profesoresService.update(profesor.id, { activo: false }).subscribe(() =>
      this.snackBar.open('Profesor desactivado', 'Cerrar', { duration: 2500 })
    );
  }
}
