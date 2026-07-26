import {
  Boletin, BloqueHorario, Curso, Estudiante, Nota, Observacion,
  Pago, Profesor, RegistroAsistencia, Usuario
} from '../models/models';

export const SEED_CURSOS: Curso[] = [
  { id: 'c-601', nombre: '6A', grado: 'Sexto', jornada: 'Mañana', directorId: 'p-1', cupoMaximo: 35 },
  { id: 'c-701', nombre: '7B', grado: 'Séptimo', jornada: 'Mañana', directorId: 'p-2', cupoMaximo: 35 },
  { id: 'c-801', nombre: '8A', grado: 'Octavo', jornada: 'Tarde', directorId: 'p-3', cupoMaximo: 30 }
];

export const SEED_PROFESORES: Profesor[] = [
  { id: 'p-1', nombres: 'Laura', apellidos: 'Gómez Ríos', documento: '1020304050', correo: 'laura.gomez@colegio.edu.co', telefono: '3001112233', especialidad: 'Matemáticas', asignaturas: ['Matemáticas', 'Geometría'], cursosAsignados: ['c-601', 'c-701'], fechaIngreso: '2019-01-15', activo: true },
  { id: 'p-2', nombres: 'Carlos', apellidos: 'Martínez Peña', documento: '1020304051', correo: 'carlos.martinez@colegio.edu.co', telefono: '3002223344', especialidad: 'Lengua Castellana', asignaturas: ['Español', 'Literatura'], cursosAsignados: ['c-701', 'c-801'], fechaIngreso: '2020-02-01', activo: true },
  { id: 'p-3', nombres: 'Diana', apellidos: 'Restrepo Silva', documento: '1020304052', correo: 'diana.restrepo@colegio.edu.co', telefono: '3003334455', especialidad: 'Ciencias Naturales', asignaturas: ['Biología', 'Química'], cursosAsignados: ['c-801'], fechaIngreso: '2018-06-10', activo: true },
  { id: 'p-4', nombres: 'Andrés', apellidos: 'Torres Lima', documento: '1020304053', correo: 'andres.torres@colegio.edu.co', telefono: '3004445566', especialidad: 'Educación Física', asignaturas: ['Educación Física'], cursosAsignados: ['c-601', 'c-701', 'c-801'], fechaIngreso: '2021-01-20', activo: true },
  { id: 'p-5', nombres: 'Mónica', apellidos: 'Vargas Ospina', documento: '1020304054', correo: 'monica.vargas@colegio.edu.co', telefono: '3005556677', especialidad: 'Inglés', asignaturas: ['Inglés'], cursosAsignados: ['c-601', 'c-801'], fechaIngreso: '2022-03-05', activo: true }
];

export const SEED_ESTUDIANTES: Estudiante[] = [
  { id: 'e-1', nombres: 'Juan Sebastián', apellidos: 'Pérez López', tipoDocumento: 'TI', documento: '1098765432', fechaNacimiento: '2013-04-12', genero: 'M', direccion: 'Cra 45 #12-30', telefono: '3111234567', correo: 'juan.perez@estudiante.edu.co', acudienteNombre: 'Marta López', acudienteTelefono: '3111234500', acudienteCorreo: 'marta.lopez@gmail.com', cursoId: 'c-601', estadoMatricula: 'Activa', fechaMatricula: '2026-01-20', anioLectivo: '2026' },
  { id: 'e-2', nombres: 'María José', apellidos: 'Rodríguez Cano', tipoDocumento: 'TI', documento: '1098765433', fechaNacimiento: '2013-07-03', genero: 'F', direccion: 'Calle 80 #23-11', telefono: '3122345678', correo: 'maria.rodriguez@estudiante.edu.co', acudienteNombre: 'Pedro Rodríguez', acudienteTelefono: '3122345600', acudienteCorreo: 'pedro.rodriguez@gmail.com', cursoId: 'c-601', estadoMatricula: 'Activa', fechaMatricula: '2026-01-20', anioLectivo: '2026' },
  { id: 'e-3', nombres: 'Samuel', apellidos: 'Ortiz Bedoya', tipoDocumento: 'TI', documento: '1098765434', fechaNacimiento: '2013-02-25', genero: 'M', direccion: 'Cra 10 #5-60', telefono: '3133456789', correo: 'samuel.ortiz@estudiante.edu.co', acudienteNombre: 'Sandra Bedoya', acudienteTelefono: '3133456700', acudienteCorreo: 'sandra.bedoya@gmail.com', cursoId: 'c-601', estadoMatricula: 'Activa', fechaMatricula: '2026-01-21', anioLectivo: '2026' },
  { id: 'e-4', nombres: 'Valentina', apellidos: 'Hernández Ruiz', tipoDocumento: 'TI', documento: '1098765435', fechaNacimiento: '2012-11-18', genero: 'F', direccion: 'Calle 33 #9-45', telefono: '3144567890', correo: 'valentina.hernandez@estudiante.edu.co', acudienteNombre: 'Luis Hernández', acudienteTelefono: '3144567800', acudienteCorreo: 'luis.hernandez@gmail.com', cursoId: 'c-701', estadoMatricula: 'Activa', fechaMatricula: '2026-01-19', anioLectivo: '2026' },
  { id: 'e-5', nombres: 'Santiago', apellidos: 'Castaño Mejía', tipoDocumento: 'TI', documento: '1098765436', fechaNacimiento: '2012-09-09', genero: 'M', direccion: 'Cra 70 #40-20', telefono: '3155678901', correo: 'santiago.castano@estudiante.edu.co', acudienteNombre: 'Claudia Mejía', acudienteTelefono: '3155678900', acudienteCorreo: 'claudia.mejia@gmail.com', cursoId: 'c-701', estadoMatricula: 'Activa', fechaMatricula: '2026-01-19', anioLectivo: '2026' },
  { id: 'e-6', nombres: 'Isabella', apellidos: 'Gil Aristizábal', tipoDocumento: 'TI', documento: '1098765437', fechaNacimiento: '2012-05-30', genero: 'F', direccion: 'Calle 5 #67-12', telefono: '3166789012', correo: 'isabella.gil@estudiante.edu.co', acudienteNombre: 'Fernando Gil', acudienteTelefono: '3166789000', acudienteCorreo: 'fernando.gil@gmail.com', cursoId: 'c-701', estadoMatricula: 'Pendiente', fechaMatricula: '2026-01-22', anioLectivo: '2026' },
  { id: 'e-7', nombres: 'Mateo', apellidos: 'Jiménez Salazar', tipoDocumento: 'TI', documento: '1098765438', fechaNacimiento: '2011-12-01', genero: 'M', direccion: 'Cra 22 #15-08', telefono: '3177890123', correo: 'mateo.jimenez@estudiante.edu.co', acudienteNombre: 'Paula Salazar', acudienteTelefono: '3177890100', acudienteCorreo: 'paula.salazar@gmail.com', cursoId: 'c-801', estadoMatricula: 'Activa', fechaMatricula: '2026-01-18', anioLectivo: '2026' },
  { id: 'e-8', nombres: 'Sofía', apellidos: 'Moreno Duque', tipoDocumento: 'TI', documento: '1098765439', fechaNacimiento: '2011-08-22', genero: 'F', direccion: 'Calle 100 #18-33', telefono: '3188901234', correo: 'sofia.moreno@estudiante.edu.co', acudienteNombre: 'Ricardo Moreno', acudienteTelefono: '3188901200', acudienteCorreo: 'ricardo.moreno@gmail.com', cursoId: 'c-801', estadoMatricula: 'Activa', fechaMatricula: '2026-01-18', anioLectivo: '2026' },
  { id: 'e-9', nombres: 'Nicolás', apellidos: 'Suárez Peña', tipoDocumento: 'TI', documento: '1098765440', fechaNacimiento: '2011-03-14', genero: 'M', direccion: 'Cra 88 #21-55', telefono: '3199012345', correo: 'nicolas.suarez@estudiante.edu.co', acudienteNombre: 'Adriana Peña', acudienteTelefono: '3199012300', acudienteCorreo: 'adriana.pena@gmail.com', cursoId: 'c-801', estadoMatricula: 'Retirada', fechaMatricula: '2026-01-18', anioLectivo: '2026' },
  { id: 'e-10', nombres: 'Camila', apellidos: 'Ramírez Ocampo', tipoDocumento: 'TI', documento: '1098765441', fechaNacimiento: '2013-01-27', genero: 'F', direccion: 'Calle 60 #30-14', telefono: '3200123456', correo: 'camila.ramirez@estudiante.edu.co', acudienteNombre: 'Jorge Ramírez', acudienteTelefono: '3200123400', acudienteCorreo: 'jorge.ramirez@gmail.com', cursoId: 'c-601', estadoMatricula: 'Activa', fechaMatricula: '2026-01-20', anioLectivo: '2026' }
];

export const SEED_HORARIOS: BloqueHorario[] = [
  { id: 'h-1', cursoId: 'c-601', dia: 'Lunes', horaInicio: '07:00', horaFin: '07:50', asignatura: 'Matemáticas', profesorId: 'p-1', aula: '101' },
  { id: 'h-2', cursoId: 'c-601', dia: 'Lunes', horaInicio: '07:50', horaFin: '08:40', asignatura: 'Español', profesorId: 'p-2', aula: '101' },
  { id: 'h-3', cursoId: 'c-601', dia: 'Lunes', horaInicio: '09:00', horaFin: '09:50', asignatura: 'Inglés', profesorId: 'p-5', aula: '101' },
  { id: 'h-4', cursoId: 'c-601', dia: 'Martes', horaInicio: '07:00', horaFin: '07:50', asignatura: 'Educación Física', profesorId: 'p-4', aula: 'Cancha' },
  { id: 'h-5', cursoId: 'c-601', dia: 'Martes', horaInicio: '07:50', horaFin: '08:40', asignatura: 'Matemáticas', profesorId: 'p-1', aula: '101' },
  { id: 'h-6', cursoId: 'c-701', dia: 'Lunes', horaInicio: '07:00', horaFin: '07:50', asignatura: 'Español', profesorId: 'p-2', aula: '102' },
  { id: 'h-7', cursoId: 'c-701', dia: 'Lunes', horaInicio: '07:50', horaFin: '08:40', asignatura: 'Matemáticas', profesorId: 'p-1', aula: '102' },
  { id: 'h-8', cursoId: 'c-801', dia: 'Lunes', horaInicio: '13:00', horaFin: '13:50', asignatura: 'Biología', profesorId: 'p-3', aula: '201' },
  { id: 'h-9', cursoId: 'c-801', dia: 'Lunes', horaInicio: '13:50', horaFin: '14:40', asignatura: 'Inglés', profesorId: 'p-5', aula: '201' }
];

export const SEED_NOTAS: Nota[] = [
  { id: 'n-1', estudianteId: 'e-1', cursoId: 'c-601', asignatura: 'Matemáticas', periodo: 1, descripcion: 'Taller 1', valor: 4.2, porcentaje: 20, fecha: '2026-02-10', registradoPor: 'p-1' },
  { id: 'n-2', estudianteId: 'e-1', cursoId: 'c-601', asignatura: 'Matemáticas', periodo: 1, descripcion: 'Examen parcial', valor: 3.8, porcentaje: 30, fecha: '2026-02-25', registradoPor: 'p-1' },
  { id: 'n-3', estudianteId: 'e-2', cursoId: 'c-601', asignatura: 'Matemáticas', periodo: 1, descripcion: 'Taller 1', valor: 4.8, porcentaje: 20, fecha: '2026-02-10', registradoPor: 'p-1' },
  { id: 'n-4', estudianteId: 'e-2', cursoId: 'c-601', asignatura: 'Matemáticas', periodo: 1, descripcion: 'Examen parcial', valor: 4.5, porcentaje: 30, fecha: '2026-02-25', registradoPor: 'p-1' },
  { id: 'n-5', estudianteId: 'e-3', cursoId: 'c-601', asignatura: 'Matemáticas', periodo: 1, descripcion: 'Taller 1', valor: 3.0, porcentaje: 20, fecha: '2026-02-10', registradoPor: 'p-1' }
];

export const SEED_ASISTENCIA: RegistroAsistencia[] = [
  { id: 'a-1', cursoId: 'c-601', estudianteId: 'e-1', fecha: '2026-07-20', estado: 'Presente', registradoPor: 'p-1' },
  { id: 'a-2', cursoId: 'c-601', estudianteId: 'e-2', fecha: '2026-07-20', estado: 'Presente', registradoPor: 'p-1' },
  { id: 'a-3', cursoId: 'c-601', estudianteId: 'e-3', fecha: '2026-07-20', estado: 'Ausente', observacion: 'Cita médica', registradoPor: 'p-1' },
  { id: 'a-4', cursoId: 'c-601', estudianteId: 'e-10', fecha: '2026-07-20', estado: 'Tarde', registradoPor: 'p-1' }
];

export const SEED_OBSERVACIONES: Observacion[] = [
  { id: 'o-1', estudianteId: 'e-3', cursoId: 'c-601', tipo: 'Negativa', titulo: 'Incumplimiento de tareas', descripcion: 'No presentó el taller de matemáticas asignado.', fecha: '2026-07-15', registradoPor: 'p-1', compromiso: 'Entregar el taller antes del viernes.' },
  { id: 'o-2', estudianteId: 'e-2', cursoId: 'c-601', tipo: 'Positiva', titulo: 'Liderazgo en clase', descripcion: 'Apoyó a sus compañeros en la actividad grupal de geometría.', fecha: '2026-07-18', registradoPor: 'p-1' }
];

export const SEED_PAGOS: Pago[] = [
  { id: 'pg-1', estudianteId: 'e-1', concepto: 'Pensión Julio', periodo: '2026-07', monto: 350000, fechaVencimiento: '2026-07-10', fechaPago: '2026-07-08', estado: 'Pagado', metodoPago: 'PSE', referencia: 'PSE-9931' },
  { id: 'pg-2', estudianteId: 'e-1', concepto: 'Pensión Agosto', periodo: '2026-08', monto: 350000, fechaVencimiento: '2026-08-10', estado: 'Pendiente' },
  { id: 'pg-3', estudianteId: 'e-2', concepto: 'Pensión Julio', periodo: '2026-07', monto: 350000, fechaVencimiento: '2026-07-10', estado: 'Vencido' },
  { id: 'pg-4', estudianteId: 'e-3', concepto: 'Matrícula 2026', periodo: '2026-01', monto: 500000, fechaVencimiento: '2026-01-15', fechaPago: '2026-01-14', estado: 'Pagado', metodoPago: 'Transferencia', referencia: 'TRX-5521' }
];

/** Usuarios demo (simulan el User Pool de Amazon Cognito). Contraseña en el mock: "colegio123" para todos. */
export const SEED_USUARIOS: Usuario[] = [
  { id: 'u-1', nombre: 'Admin Institucional', correo: 'admin@colegio.edu.co', rol: 'admin', activo: true },
  { id: 'u-2', nombre: 'Laura Gómez Ríos', correo: 'laura.gomez@colegio.edu.co', rol: 'profesor', refId: 'p-1', activo: true },
  { id: 'u-3', nombre: 'Juan Sebastián Pérez', correo: 'juan.perez@estudiante.edu.co', rol: 'estudiante', refId: 'e-1', activo: true }
];

export const SEED_BOLETINES: Boletin[] = [];
