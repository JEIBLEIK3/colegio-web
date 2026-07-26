-- Esquema del Sistema Escolar para Supabase (Postgres).
-- Espeja 1:1 las interfaces de src/app/core/models/models.ts: columnas en
-- camelCase (entre comillas) para que el cliente de Supabase devuelva JSON
-- con las mismas claves que usa el frontend, sin necesidad de mapeos.

create table if not exists profesores (
  id text primary key,
  nombres text not null,
  apellidos text not null,
  documento text not null unique,
  correo text not null unique,
  telefono text,
  especialidad text,
  asignaturas text[] not null default '{}',
  "cursosAsignados" text[] not null default '{}',
  "fechaIngreso" date not null,
  activo boolean not null default true
);

create table if not exists cursos (
  id text primary key,
  nombre text not null,
  grado text not null,
  jornada text not null check (jornada in ('Mañana', 'Tarde', 'Única')),
  "directorId" text references profesores(id) on delete set null,
  "cupoMaximo" integer not null check ("cupoMaximo" > 0)
);

create table if not exists estudiantes (
  id text primary key,
  nombres text not null,
  apellidos text not null,
  "tipoDocumento" text not null check ("tipoDocumento" in ('TI', 'CC', 'RC', 'CE', 'Pasaporte')),
  documento text not null unique,
  "fechaNacimiento" date not null,
  genero text not null check (genero in ('M', 'F', 'Otro')),
  direccion text,
  telefono text,
  correo text,
  "acudienteNombre" text not null,
  "acudienteTelefono" text,
  "acudienteCorreo" text,
  "cursoId" text references cursos(id) on delete set null,
  "estadoMatricula" text not null check ("estadoMatricula" in ('Activa', 'Retirada', 'Pendiente', 'Graduado')),
  "fechaMatricula" date not null,
  "anioLectivo" text not null,
  "observacionesMedicas" text,
  "documentoUrl" text
);

create table if not exists horarios (
  id text primary key,
  "cursoId" text not null references cursos(id) on delete cascade,
  dia text not null check (dia in ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes')),
  "horaInicio" text not null,
  "horaFin" text not null,
  asignatura text not null,
  "profesorId" text references profesores(id) on delete set null,
  aula text
);

create table if not exists asistencia (
  id text primary key,
  "cursoId" text not null references cursos(id) on delete cascade,
  "estudianteId" text not null references estudiantes(id) on delete cascade,
  fecha date not null,
  estado text not null check (estado in ('Presente', 'Ausente', 'Tarde', 'Excusa')),
  observacion text,
  "registradoPor" text references profesores(id) on delete set null,
  unique ("cursoId", "estudianteId", fecha)
);

create table if not exists notas (
  id text primary key,
  "estudianteId" text not null references estudiantes(id) on delete cascade,
  "cursoId" text not null references cursos(id) on delete cascade,
  asignatura text not null,
  periodo smallint not null check (periodo in (1, 2, 3, 4)),
  descripcion text not null,
  valor numeric(3, 1) not null check (valor >= 0 and valor <= 5),
  porcentaje numeric(5, 2) not null check (porcentaje >= 0 and porcentaje <= 100),
  fecha date not null,
  "registradoPor" text references profesores(id) on delete set null
);

create table if not exists observaciones (
  id text primary key,
  "estudianteId" text not null references estudiantes(id) on delete cascade,
  "cursoId" text not null references cursos(id) on delete cascade,
  tipo text not null check (tipo in ('Positiva', 'Negativa', 'Neutra', 'Convivencial')),
  titulo text not null,
  descripcion text not null,
  fecha date not null,
  "registradoPor" text references profesores(id) on delete set null,
  compromiso text
);

create table if not exists pagos (
  id text primary key,
  "estudianteId" text not null references estudiantes(id) on delete cascade,
  concepto text not null,
  periodo text not null,
  monto numeric(12, 2) not null check (monto >= 0),
  "fechaVencimiento" date not null,
  "fechaPago" date,
  estado text not null check (estado in ('Pagado', 'Pendiente', 'Vencido')),
  "metodoPago" text check ("metodoPago" in ('Transferencia', 'Efectivo', 'Tarjeta', 'PSE')),
  referencia text
);

-- Vincula cada usuario de negocio con su cuenta de Supabase Auth
-- (auth.users). "refId" apunta a profesores.id o estudiantes.id según el rol.
create table if not exists usuarios (
  id text primary key,
  "authUserId" uuid unique references auth.users(id) on delete cascade,
  nombre text not null,
  correo text not null unique,
  rol text not null check (rol in ('admin', 'profesor', 'estudiante')),
  "refId" text,
  activo boolean not null default true
);

create index if not exists idx_estudiantes_curso on estudiantes ("cursoId");
create index if not exists idx_horarios_curso on horarios ("cursoId");
create index if not exists idx_asistencia_curso_fecha on asistencia ("cursoId", fecha);
create index if not exists idx_asistencia_estudiante on asistencia ("estudianteId");
create index if not exists idx_notas_estudiante_periodo on notas ("estudianteId", periodo);
create index if not exists idx_observaciones_estudiante on observaciones ("estudianteId");
create index if not exists idx_pagos_estudiante on pagos ("estudianteId");

-- Nota: "Boletin" (models.ts) no tiene tabla propia porque es un agregado
-- calculado (notas + asistencia + observaciones), igual que en el diseño AWS
-- original (Lambda `generarBoletin`). Se sigue calculando en el frontend / o,
-- a futuro, en una función Postgres (`rpc`) sobre estas mismas tablas.
