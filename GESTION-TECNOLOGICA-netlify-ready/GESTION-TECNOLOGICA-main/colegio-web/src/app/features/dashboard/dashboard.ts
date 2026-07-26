import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/auth/auth.service';
import { EstudiantesService } from '../../core/services/estudiantes.service';
import { ProfesoresService } from '../../core/services/profesores.service';
import { PagosService } from '../../core/services/pagos.service';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { CursosService } from '../../core/services/cursos.service';
import { NotasService } from '../../core/services/notas.service';
import { ObservacionesService } from '../../core/services/observaciones.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  private readonly estudiantesService = inject(EstudiantesService);
  private readonly profesoresService = inject(ProfesoresService);
  private readonly pagosService = inject(PagosService);
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly cursosService = inject(CursosService);
  private readonly notasService = inject(NotasService);
  private readonly observacionesService = inject(ObservacionesService);

  readonly usuario = this.auth.usuario;
  readonly rol = this.auth.rol;

  readonly kpisAdmin = computed(() => {
    const estudiantes = this.estudiantesService.items();
    const pagos = this.pagosService.items();
    const asistenciaHoy = this.asistenciaService.items();
    const presentes = asistenciaHoy.filter(a => a.estado === 'Presente' || a.estado === 'Tarde').length;
    return [
      { etiqueta: 'Estudiantes activos', valor: estudiantes.filter(e => e.estadoMatricula === 'Activa').length, icono: 'groups', color: '#1b4b91' },
      { etiqueta: 'Profesores', valor: this.profesoresService.items().length, icono: 'badge', color: '#0f766e' },
      { etiqueta: 'Cursos', valor: this.cursosService.items().length, icono: 'meeting_room', color: '#6d28d9' },
      { etiqueta: 'Pagos pendientes/vencidos', valor: pagos.filter(p => p.estado !== 'Pagado').length, icono: 'payments', color: '#b45309' },
      { etiqueta: '% Asistencia (últimos registros)', valor: asistenciaHoy.length ? Math.round((presentes / asistenciaHoy.length) * 100) + '%' : 'N/D', icono: 'fact_check', color: '#15803d' }
    ];
  });

  readonly misCursos = computed(() => {
    const prof = this.profesoresService.items().find(p => p.id === this.usuario()?.refId);
    if (!prof) return [];
    return this.cursosService.items().filter(c => prof.cursosAsignados.includes(c.id));
  });

  readonly resumenEstudiante = computed(() => {
    const est = this.estudiantesService.items().find(e => e.id === this.usuario()?.refId);
    if (!est) return null;
    const curso = this.cursosService.items().find(c => c.id === est.cursoId);
    const notas = this.notasService.items().filter(n => n.estudianteId === est.id);
    const promedio = notas.length ? (notas.reduce((s, n) => s + n.valor, 0) / notas.length).toFixed(1) : 'N/D';
    const pagosPendientes = this.pagosService.items().filter(p => p.estudianteId === est.id && p.estado !== 'Pagado').length;
    const observaciones = this.observacionesService.items().filter(o => o.estudianteId === est.id).length;
    return { estudiante: est, curso, promedio, pagosPendientes, observaciones };
  });

  readonly accesosRapidos = [
    { ruta: '/matriculas', etiqueta: 'Matrículas', icono: 'how_to_reg' },
    { ruta: '/asistencia', etiqueta: 'Asistencia', icono: 'fact_check' },
    { ruta: '/notas', etiqueta: 'Notas', icono: 'grade' },
    { ruta: '/boletines', etiqueta: 'Boletines', icono: 'summarize' }
  ];
}
