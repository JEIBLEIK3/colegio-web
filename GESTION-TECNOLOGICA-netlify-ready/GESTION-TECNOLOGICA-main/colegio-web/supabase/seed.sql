-- Datos de prueba (equivalentes a src/app/core/data/seed-data.ts) para
-- poblar el proyecto de Supabase recién creado. Ejecutar después de
-- 0001_schema.sql y 0002_rls.sql.

insert into profesores (id, nombres, apellidos, documento, correo, telefono, especialidad, asignaturas, "cursosAsignados", "fechaIngreso", activo) values
  ('p-1', 'Laura', 'Gómez Ríos', '1020304050', 'laura.gomez@colegio.edu.co', '3001112233', 'Matemáticas', array['Matemáticas','Geometría'], array['c-601','c-701'], '2019-01-15', true),
  ('p-2', 'Carlos', 'Martínez Peña', '1020304051', 'carlos.martinez@colegio.edu.co', '3002223344', 'Lengua Castellana', array['Español','Literatura'], array['c-701','c-801'], '2020-02-01', true),
  ('p-3', 'Diana', 'Restrepo Silva', '1020304052', 'diana.restrepo@colegio.edu.co', '3003334455', 'Ciencias Naturales', array['Biología','Química'], array['c-801'], '2018-06-10', true),
  ('p-4', 'Andrés', 'Torres Lima', '1020304053', 'andres.torres@colegio.edu.co', '3004445566', 'Educación Física', array['Educación Física'], array['c-601','c-701','c-801'], '2021-01-20', true),
  ('p-5', 'Mónica', 'Vargas Ospina', '1020304054', 'monica.vargas@colegio.edu.co', '3005556677', 'Inglés', array['Inglés'], array['c-601','c-801'], '2022-03-05', true)
on conflict (id) do nothing;

insert into cursos (id, nombre, grado, jornada, "directorId", "cupoMaximo") values
  ('c-601', '6A', 'Sexto', 'Mañana', 'p-1', 35),
  ('c-701', '7B', 'Séptimo', 'Mañana', 'p-2', 35),
  ('c-801', '8A', 'Octavo', 'Tarde', 'p-3', 30)
on conflict (id) do nothing;

insert into estudiantes (id, nombres, apellidos, "tipoDocumento", documento, "fechaNacimiento", genero, direccion, telefono, correo, "acudienteNombre", "acudienteTelefono", "acudienteCorreo", "cursoId", "estadoMatricula", "fechaMatricula", "anioLectivo") values
  ('e-1', 'Juan Sebastián', 'Pérez López', 'TI', '1098765432', '2013-04-12', 'M', 'Cra 45 #12-30', '3111234567', 'juan.perez@estudiante.edu.co', 'Marta López', '3111234500', 'marta.lopez@gmail.com', 'c-601', 'Activa', '2026-01-20', '2026'),
  ('e-2', 'María José', 'Rodríguez Cano', 'TI', '1098765433', '2013-07-03', 'F', 'Calle 80 #23-11', '3122345678', 'maria.rodriguez@estudiante.edu.co', 'Pedro Rodríguez', '3122345600', 'pedro.rodriguez@gmail.com', 'c-601', 'Activa', '2026-01-20', '2026'),
  ('e-3', 'Samuel', 'Ortiz Bedoya', 'TI', '1098765434', '2013-02-25', 'M', 'Cra 10 #5-60', '3133456789', 'samuel.ortiz@estudiante.edu.co', 'Sandra Bedoya', '3133456700', 'sandra.bedoya@gmail.com', 'c-601', 'Activa', '2026-01-21', '2026'),
  ('e-4', 'Valentina', 'Hernández Ruiz', 'TI', '1098765435', '2012-11-18', 'F', 'Calle 33 #9-45', '3144567890', 'valentina.hernandez@estudiante.edu.co', 'Luis Hernández', '3144567800', 'luis.hernandez@gmail.com', 'c-701', 'Activa', '2026-01-19', '2026'),
  ('e-5', 'Santiago', 'Castaño Mejía', 'TI', '1098765436', '2012-09-09', 'M', 'Cra 70 #40-20', '3155678901', 'santiago.castano@estudiante.edu.co', 'Claudia Mejía', '3155678900', 'claudia.mejia@gmail.com', 'c-701', 'Activa', '2026-01-19', '2026'),
  ('e-6', 'Isabella', 'Gil Aristizábal', 'TI', '1098765437', '2012-05-30', 'F', 'Calle 5 #67-12', '3166789012', 'isabella.gil@estudiante.edu.co', 'Fernando Gil', '3166789000', 'fernando.gil@gmail.com', 'c-701', 'Pendiente', '2026-01-22', '2026'),
  ('e-7', 'Mateo', 'Jiménez Salazar', 'TI', '1098765438', '2011-12-01', 'M', 'Cra 22 #15-08', '3177890123', 'mateo.jimenez@estudiante.edu.co', 'Paula Salazar', '3177890100', 'paula.salazar@gmail.com', 'c-801', 'Activa', '2026-01-18', '2026'),
  ('e-8', 'Sofía', 'Moreno Duque', 'TI', '1098765439', '2011-08-22', 'F', 'Calle 100 #18-33', '3188901234', 'sofia.moreno@estudiante.edu.co', 'Ricardo Moreno', '3188901200', 'ricardo.moreno@gmail.com', 'c-801', 'Activa', '2026-01-18', '2026'),
  ('e-9', 'Nicolás', 'Suárez Peña', 'TI', '1098765440', '2011-03-14', 'M', 'Cra 88 #21-55', '3199012345', 'nicolas.suarez@estudiante.edu.co', 'Adriana Peña', '3199012300', 'adriana.pena@gmail.com', 'c-801', 'Retirada', '2026-01-18', '2026'),
  ('e-10', 'Camila', 'Ramírez Ocampo', 'TI', '1098765441', '2013-01-27', 'F', 'Calle 60 #30-14', '3200123456', 'camila.ramirez@estudiante.edu.co', 'Jorge Ramírez', '3200123400', 'jorge.ramirez@gmail.com', 'c-601', 'Activa', '2026-01-20', '2026')
on conflict (id) do nothing;

insert into horarios (id, "cursoId", dia, "horaInicio", "horaFin", asignatura, "profesorId", aula) values
  ('h-1', 'c-601', 'Lunes', '07:00', '07:50', 'Matemáticas', 'p-1', '101'),
  ('h-2', 'c-601', 'Lunes', '07:50', '08:40', 'Español', 'p-2', '101'),
  ('h-3', 'c-601', 'Lunes', '09:00', '09:50', 'Inglés', 'p-5', '101'),
  ('h-4', 'c-601', 'Martes', '07:00', '07:50', 'Educación Física', 'p-4', 'Cancha'),
  ('h-5', 'c-601', 'Martes', '07:50', '08:40', 'Matemáticas', 'p-1', '101'),
  ('h-6', 'c-701', 'Lunes', '07:00', '07:50', 'Español', 'p-2', '102'),
  ('h-7', 'c-701', 'Lunes', '07:50', '08:40', 'Matemáticas', 'p-1', '102'),
  ('h-8', 'c-801', 'Lunes', '13:00', '13:50', 'Biología', 'p-3', '201'),
  ('h-9', 'c-801', 'Lunes', '13:50', '14:40', 'Inglés', 'p-5', '201')
on conflict (id) do nothing;

insert into notas (id, "estudianteId", "cursoId", asignatura, periodo, descripcion, valor, porcentaje, fecha, "registradoPor") values
  ('n-1', 'e-1', 'c-601', 'Matemáticas', 1, 'Taller 1', 4.2, 20, '2026-02-10', 'p-1'),
  ('n-2', 'e-1', 'c-601', 'Matemáticas', 1, 'Examen parcial', 3.8, 30, '2026-02-25', 'p-1'),
  ('n-3', 'e-2', 'c-601', 'Matemáticas', 1, 'Taller 1', 4.8, 20, '2026-02-10', 'p-1'),
  ('n-4', 'e-2', 'c-601', 'Matemáticas', 1, 'Examen parcial', 4.5, 30, '2026-02-25', 'p-1'),
  ('n-5', 'e-3', 'c-601', 'Matemáticas', 1, 'Taller 1', 3.0, 20, '2026-02-10', 'p-1')
on conflict (id) do nothing;

insert into asistencia (id, "cursoId", "estudianteId", fecha, estado, observacion, "registradoPor") values
  ('a-1', 'c-601', 'e-1', '2026-07-20', 'Presente', null, 'p-1'),
  ('a-2', 'c-601', 'e-2', '2026-07-20', 'Presente', null, 'p-1'),
  ('a-3', 'c-601', 'e-3', '2026-07-20', 'Ausente', 'Cita médica', 'p-1'),
  ('a-4', 'c-601', 'e-10', '2026-07-20', 'Tarde', null, 'p-1')
on conflict (id) do nothing;

insert into observaciones (id, "estudianteId", "cursoId", tipo, titulo, descripcion, fecha, "registradoPor", compromiso) values
  ('o-1', 'e-3', 'c-601', 'Negativa', 'Incumplimiento de tareas', 'No presentó el taller de matemáticas asignado.', '2026-07-15', 'p-1', 'Entregar el taller antes del viernes.'),
  ('o-2', 'e-2', 'c-601', 'Positiva', 'Liderazgo en clase', 'Apoyó a sus compañeros en la actividad grupal de geometría.', '2026-07-18', 'p-1', null)
on conflict (id) do nothing;

insert into pagos (id, "estudianteId", concepto, periodo, monto, "fechaVencimiento", "fechaPago", estado, "metodoPago", referencia) values
  ('pg-1', 'e-1', 'Pensión Julio', '2026-07', 350000, '2026-07-10', '2026-07-08', 'Pagado', 'PSE', 'PSE-9931'),
  ('pg-2', 'e-1', 'Pensión Agosto', '2026-08', 350000, '2026-08-10', null, 'Pendiente', null, null),
  ('pg-3', 'e-2', 'Pensión Julio', '2026-07', 350000, '2026-07-10', null, 'Vencido', null, null),
  ('pg-4', 'e-3', 'Matrícula 2026', '2026-01', 500000, '2026-01-15', '2026-01-14', 'Pagado', 'Transferencia', 'TRX-5521')
on conflict (id) do nothing;

-- `usuarios` queda fuera de este seed a propósito: cada fila requiere un
-- "authUserId" que apunte a una cuenta real en auth.users. Primero crea los
-- 3 usuarios demo (Authentication > Users, o supabase.auth.admin.createUser)
-- y luego inserta aquí usando el UUID que te devuelva Supabase, por ejemplo:
--
-- insert into usuarios (id, "authUserId", nombre, correo, rol, "refId", activo) values
--   ('u-1', '<uuid-admin>',    'Admin Institucional',      'admin@colegio.edu.co',           'admin',      null,  true),
--   ('u-2', '<uuid-profesor>', 'Laura Gómez Ríos',         'laura.gomez@colegio.edu.co',     'profesor',   'p-1', true),
--   ('u-3', '<uuid-estudiante>','Juan Sebastián Pérez',    'juan.perez@estudiante.edu.co',   'estudiante', 'e-1', true);
