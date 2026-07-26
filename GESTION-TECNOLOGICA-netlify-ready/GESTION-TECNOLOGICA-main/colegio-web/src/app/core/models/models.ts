export type Rol = 'admin' | 'profesor' | 'estudiante';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: Rol;
  /** Vincula al usuario con su registro de negocio (Profesor.id o Estudiante.id) cuando aplica */
  refId?: string;
  activo: boolean;
}

export type Jornada = 'Mañana' | 'Tarde' | 'Única';
export type EstadoMatricula = 'Activa' | 'Retirada' | 'Pendiente' | 'Graduado';

export interface Curso {
  id: string;
  nombre: string; // ej: "6A"
  grado: string;  // ej: "Sexto"
  jornada: Jornada;
  directorId?: string; // id Profesor director de grupo
  cupoMaximo: number;
}

export interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: 'TI' | 'CC' | 'RC' | 'CE' | 'Pasaporte';
  documento: string;
  fechaNacimiento: string; // ISO
  genero: 'M' | 'F' | 'Otro';
  direccion: string;
  telefono: string;
  correo: string;
  acudienteNombre: string;
  acudienteTelefono: string;
  acudienteCorreo: string;
  cursoId: string;
  estadoMatricula: EstadoMatricula;
  fechaMatricula: string; // ISO
  anioLectivo: string; // ej "2026"
  observacionesMedicas?: string;
  documentoUrl?: string; // ruta simulada en S3 (colegio-documentos)
}

export interface Profesor {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  correo: string;
  telefono: string;
  especialidad: string;
  asignaturas: string[];
  cursosAsignados: string[]; // ids de Curso
  fechaIngreso: string;
  activo: boolean;
}

export type EstadoAsistencia = 'Presente' | 'Ausente' | 'Tarde' | 'Excusa';

export interface RegistroAsistencia {
  id: string;
  cursoId: string;
  estudianteId: string;
  fecha: string; // ISO yyyy-MM-dd
  estado: EstadoAsistencia;
  observacion?: string;
  registradoPor: string; // profesorId
}

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

export interface BloqueHorario {
  id: string;
  cursoId: string;
  dia: DiaSemana;
  horaInicio: string; // "07:00"
  horaFin: string;    // "07:50"
  asignatura: string;
  profesorId: string;
  aula?: string;
}

export interface Nota {
  id: string;
  estudianteId: string;
  cursoId: string;
  asignatura: string;
  periodo: 1 | 2 | 3 | 4;
  descripcion: string; // ej "Examen final", "Taller 1"
  valor: number; // 0.0 - 5.0
  porcentaje: number; // peso dentro del periodo
  fecha: string;
  registradoPor: string;
}

export type TipoObservacion = 'Positiva' | 'Negativa' | 'Neutra' | 'Convivencial';

export interface Observacion {
  id: string;
  estudianteId: string;
  cursoId: string;
  tipo: TipoObservacion;
  titulo: string;
  descripcion: string;
  fecha: string;
  registradoPor: string; // profesorId
  compromiso?: string;
}

export type EstadoPago = 'Pagado' | 'Pendiente' | 'Vencido';

export interface Pago {
  id: string;
  estudianteId: string;
  concepto: string; // "Pensión Febrero", "Matrícula 2026"
  periodo: string;  // "2026-02"
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: EstadoPago;
  metodoPago?: 'Transferencia' | 'Efectivo' | 'Tarjeta' | 'PSE';
  referencia?: string;
}

export interface Boletin {
  estudianteId: string;
  cursoId: string;
  periodo: 1 | 2 | 3 | 4;
  anioLectivo: string;
  promedioPorAsignatura: { asignatura: string; promedio: number }[];
  promedioGeneral: number;
  porcentajeAsistencia: number;
  totalObservaciones: number;
  fechaGeneracion: string;
}
