import { Component, computed, effect, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { CursosService } from '../../core/services/cursos.service';
import { AuthService } from '../../core/auth/auth.service';
import { EstadoAsistencia } from '../../core/models/models';

interface FilaAsistencia {
  estudianteId: string;
  nombre: string;
  estado: EstadoAsistencia;
  observacion: string;
}

const ESTADOS: EstadoAsistencia[] = ['Presente', 'Ausente', 'Tarde', 'Excusa'];

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatButtonToggleModule
  ],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.scss'
})
export class Asistencia {
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly cursosService = inject(CursosService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly estados = ESTADOS;

  readonly cursosVisibles = computed(() => {
    const rol = this.auth.rol();
    const usuario = this.auth.usuario();
    if (rol === 'admin') return this.cursosService.items();
    const prof = this.profesoresService.items().find(p => p.id === usuario?.refId);
    return this.cursosService.items().filter(c => prof?.cursosAsignados.includes(c.id));
  });

  readonly cursoSeleccionado = signal<string>('');
  readonly fechaSeleccionada = signal<string>(new Date().toISOString().slice(0, 10));
  readonly filas = signal<FilaAsistencia[]>([]);
  readonly guardando = signal(false);

  constructor() {
    effect(() => {
      const visibles = this.cursosVisibles();
      if (!this.cursoSeleccionado() && visibles.length > 0) {
        this.cursoSeleccionado.set(visibles[0].id);
      }
    });

    effect(() => {
      const cursoId = this.cursoSeleccionado();
      const fecha = this.fechaSeleccionada();
      if (!cursoId) {
        this.filas.set([]);
        return;
      }
      const estudiantesCurso = this.estudiantesService.items().filter(
        e => e.cursoId === cursoId && e.estadoMatricula === 'Activa'
      );
      const registros = this.asistenciaService.items();
      this.filas.set(
        estudiantesCurso.map(e => {
          const registro = registros.find(r => r.cursoId === cursoId && r.estudianteId === e.id && r.fecha === fecha);
          return {
            estudianteId: e.id,
            nombre: `${e.nombres} ${e.apellidos}`,
            estado: registro?.estado ?? 'Presente',
            observacion: registro?.observacion ?? ''
          };
        })
      );
    });
  }

  cambiarEstado(fila: FilaAsistencia, estado: EstadoAsistencia): void {
    this.filas.update(filas => filas.map(f => (f.estudianteId === fila.estudianteId ? { ...f, estado } : f)));
  }

  cambiarObservacion(fila: FilaAsistencia, observacion: string): void {
    this.filas.update(filas => filas.map(f => (f.estudianteId === fila.estudianteId ? { ...f, observacion } : f)));
  }

  marcarTodosPresentes(): void {
    this.filas.update(filas => filas.map(f => ({ ...f, estado: 'Presente' as EstadoAsistencia })));
  }

  guardar(): void {
    const cursoId = this.cursoSeleccionado();
    const fecha = this.fechaSeleccionada();
    const usuario = this.auth.usuario();
    const registros = this.asistenciaService.items();

    this.guardando.set(true);
    const operaciones = this.filas().map(fila => {
      const existente = registros.find(r => r.cursoId === cursoId && r.estudianteId === fila.estudianteId && r.fecha === fecha);
      if (existente) {
        return this.asistenciaService.update(existente.id, { estado: fila.estado, observacion: fila.observacion });
      }
      return this.asistenciaService.create({
        id: 'a-' + crypto.randomUUID().slice(0, 8),
        cursoId,
        estudianteId: fila.estudianteId,
        fecha,
        estado: fila.estado,
        observacion: fila.observacion || undefined,
        registradoPor: usuario?.refId ?? usuario?.id ?? ''
      });
    });

    (operaciones.length ? forkJoin(operaciones) : of([])).subscribe(() => {
      this.guardando.set(false);
      this.snackBar.open('Asistencia guardada', 'Cerrar', { duration: 2500 });
    });
  }
}
