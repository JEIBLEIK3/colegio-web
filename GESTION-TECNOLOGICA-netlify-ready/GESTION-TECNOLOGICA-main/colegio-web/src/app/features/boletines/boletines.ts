import { Component, computed, effect, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoletinesService } from '../../core/services/boletines.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { CursosService } from '../../core/services/cursos.service';
import { AuthService } from '../../core/auth/auth.service';
import { Boletin } from '../../core/models/models';

@Component({
  selector: 'app-boletines',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, MatTableModule, SlicePipe],
  templateUrl: './boletines.html',
  styleUrl: './boletines.scss'
})
export class Boletines {
  private readonly boletinesService = inject(BoletinesService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly cursosService = inject(CursosService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly periodos = [1, 2, 3, 4] as const;
  readonly columnasAsignaturas = ['asignatura', 'promedio'];

  readonly estudiantesVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    if (rol === 'admin') return this.estudiantesService.items().filter(e => e.estadoMatricula === 'Activa');
    if (rol === 'profesor') {
      const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
      return this.estudiantesService.items().filter(
        e => e.estadoMatricula === 'Activa' && prof?.cursosAsignados.includes(e.cursoId)
      );
    }
    return this.estudiantesService.items().filter(e => e.id === usuario?.refId);
  });

  readonly estudianteSeleccionado = signal<string>('');
  readonly periodoSeleccionado = signal<1 | 2 | 3 | 4>(1);
  readonly boletin = signal<Boletin | null>(null);

  constructor() {
    effect(() => {
      const visibles = this.estudiantesVisibles();
      if (!this.estudianteSeleccionado() && visibles.length > 0) {
        this.estudianteSeleccionado.set(visibles[0].id);
      }
    });
  }

  get estudianteActual() {
    return this.estudiantesService.items().find(e => e.id === this.estudianteSeleccionado());
  }

  get cursoActual() {
    return this.cursosService.items().find(c => c.id === this.estudianteActual?.cursoId);
  }

  generar(): void {
    const estudiante = this.estudianteActual;
    if (!estudiante) return;
    const resultado = this.boletinesService.generar(
      estudiante.id,
      estudiante.cursoId,
      this.periodoSeleccionado(),
      estudiante.anioLectivo
    );
    this.boletin.set(resultado);
    this.snackBar.open('Boletín generado', 'Cerrar', { duration: 2000 });
  }

  imprimir(): void {
    window.print();
  }
}
