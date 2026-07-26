import { Injectable, inject } from '@angular/core';
import { Boletin } from '../models/models';
import { NotasService } from './notas.service';
import { AsistenciaService } from './asistencia.service';
import { ObservacionesService } from './observaciones.service';

/**
 * El boletín no es una tabla propia: se calcula a partir de Notas, Asistencia
 * y Observaciones. En AWS este cálculo lo haría una Lambda "generarBoletin"
 * invocada bajo demanda (o vía EventBridge al cierre de cada periodo),
 * guardando el resultado en S3 como PDF y su metadato en DynamoDB.
 */
@Injectable({ providedIn: 'root' })
export class BoletinesService {
  private readonly notasService = inject(NotasService);
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly observacionesService = inject(ObservacionesService);

  generar(estudianteId: string, cursoId: string, periodo: 1 | 2 | 3 | 4, anioLectivo: string): Boletin {
    const notas = this.notasService.items().filter(
      n => n.estudianteId === estudianteId && n.periodo === periodo
    );

    const porAsignatura = new Map<string, { sumaPonderada: number; sumaPesos: number }>();
    for (const n of notas) {
      const acc = porAsignatura.get(n.asignatura) ?? { sumaPonderada: 0, sumaPesos: 0 };
      acc.sumaPonderada += n.valor * n.porcentaje;
      acc.sumaPesos += n.porcentaje;
      porAsignatura.set(n.asignatura, acc);
    }

    const promedioPorAsignatura = Array.from(porAsignatura.entries()).map(([asignatura, acc]) => ({
      asignatura,
      promedio: acc.sumaPesos > 0 ? Number((acc.sumaPonderada / acc.sumaPesos).toFixed(2)) : 0
    }));

    const promedioGeneral = promedioPorAsignatura.length
      ? Number((promedioPorAsignatura.reduce((s, a) => s + a.promedio, 0) / promedioPorAsignatura.length).toFixed(2))
      : 0;

    const asistenciaEstudiante = this.asistenciaService.items().filter(a => a.estudianteId === estudianteId);
    const presentes = asistenciaEstudiante.filter(a => a.estado === 'Presente' || a.estado === 'Tarde').length;
    const porcentajeAsistencia = asistenciaEstudiante.length
      ? Number(((presentes / asistenciaEstudiante.length) * 100).toFixed(1))
      : 100;

    const totalObservaciones = this.observacionesService.items().filter(o => o.estudianteId === estudianteId).length;

    return {
      estudianteId,
      cursoId,
      periodo,
      anioLectivo,
      promedioPorAsignatura,
      promedioGeneral,
      porcentajeAsistencia,
      totalObservaciones,
      fechaGeneracion: new Date().toISOString()
    };
  }
}
