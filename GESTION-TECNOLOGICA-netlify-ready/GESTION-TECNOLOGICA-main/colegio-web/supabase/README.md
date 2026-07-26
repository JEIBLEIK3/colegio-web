# Base de datos en Supabase

Este directorio contiene el esquema de Postgres para el backend real del
sistema escolar (alternativa a AWS/DynamoDB, ver [../ARQUITECTURA_AWS.md](../ARQUITECTURA_AWS.md)).

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. Guarda la **contraseña de la base de datos** que definas (no se vuelve a mostrar).
3. Cuando el proyecto termine de aprovisionar, ve a **Project Settings → API** y copia:
   - `Project URL`
   - `anon public` key

## 2. Ejecutar las migraciones

En **SQL Editor** del dashboard, ejecuta en orden (o pégalos en una sola consulta):

1. `migrations/0001_schema.sql` — tablas, relaciones y constraints.
2. `migrations/0002_rls.sql` — Row Level Security por rol (admin/profesor/estudiante).
3. `seed.sql` — datos de prueba (mismos que `src/app/core/data/seed-data.ts`).

## 3. Crear los usuarios demo (Auth)

Las tablas de negocio no tienen contraseñas: la autenticación la maneja
**Supabase Auth** y la tabla `usuarios` solo vincula el rol.

En **Authentication → Users → Add user**, crea (con la contraseña que prefieras):

| Correo | Rol a vincular |
|---|---|
| admin@colegio.edu.co | admin |
| laura.gomez@colegio.edu.co | profesor (`refId = p-1`) |
| juan.perez@estudiante.edu.co | estudiante (`refId = e-1`) |

Copia el UUID (`id`) que Supabase asigna a cada usuario y complétalo al final
de `seed.sql`:

```sql
insert into usuarios (id, "authUserId", nombre, correo, rol, "refId", activo) values
  ('u-1', '<uuid-admin>',      'Admin Institucional',    'admin@colegio.edu.co',         'admin',      null,  true),
  ('u-2', '<uuid-profesor>',   'Laura Gómez Ríos',       'laura.gomez@colegio.edu.co',   'profesor',   'p-1', true),
  ('u-3', '<uuid-estudiante>', 'Juan Sebastián Pérez',   'juan.perez@estudiante.edu.co', 'estudiante', 'e-1', true);
```

## 4. Conectar el frontend

En [`src/environments/environment.ts`](../src/environments/environment.ts) (y `environment.prod.ts`):

```ts
useMockData: false,
backend: 'supabase',
supabase: {
  url: 'https://TU-PROYECTO.supabase.co',
  anonKey: 'TU-ANON-KEY'
}
```

Con `useMockData: false` y `backend: 'supabase'`, `repository-factory.ts`
usa `SupabaseRepository<T>` para las 8 entidades CRUD y `AuthService` usa
`supabase.auth.signInWithPassword` para el login. No hace falta tocar
ningún componente ni servicio de módulo.

## 5. Mantener el esquema

Si agregas o cambias un campo en `src/app/core/models/models.ts`, añade una
migración nueva (`0003_...sql`) en vez de editar `0001_schema.sql`, para
poder reproducir el historial completo en un proyecto Supabase nuevo.
