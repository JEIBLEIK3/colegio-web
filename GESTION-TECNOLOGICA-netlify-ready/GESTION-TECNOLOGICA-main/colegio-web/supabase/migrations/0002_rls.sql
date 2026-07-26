-- Row Level Security por rol (admin / profesor / estudiante), equivalente al
-- control de acceso que en el diseño AWS hacía el Lambda Authorizer con el
-- rol embebido en el JWT de Cognito. Aquí el rol vive en la tabla `usuarios`,
-- vinculada 1:1 a auth.users mediante "authUserId".

-- Funciones auxiliares (SECURITY DEFINER: pueden leer `usuarios`/`profesores`
-- saltándose RLS, evitando recursión al evaluarse dentro de las políticas).
create or replace function public.current_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from usuarios where "authUserId" = auth.uid()
$$;

create or replace function public.current_ref_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select "refId" from usuarios where "authUserId" = auth.uid()
$$;

create or replace function public.mis_cursos()
returns text[]
language sql
stable
security definer
set search_path = public
as $$
  select "cursosAsignados" from profesores where id = public.current_ref_id()
$$;

alter table profesores enable row level security;
alter table cursos enable row level security;
alter table estudiantes enable row level security;
alter table horarios enable row level security;
alter table asistencia enable row level security;
alter table notas enable row level security;
alter table observaciones enable row level security;
alter table pagos enable row level security;
alter table usuarios enable row level security;

-- usuarios: cada quien ve su propio registro; el admin los ve y gestiona todos.
create policy "usuarios_select" on usuarios for select to authenticated
  using ("authUserId" = auth.uid() or current_rol() = 'admin');
create policy "usuarios_write_admin" on usuarios for all to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');

-- profesores: lectura para cualquier usuario autenticado; escritura solo admin.
create policy "profesores_select" on profesores for select to authenticated
  using (true);
create policy "profesores_write_admin" on profesores for insert to authenticated
  with check (current_rol() = 'admin');
create policy "profesores_update_admin" on profesores for update to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');
create policy "profesores_delete_admin" on profesores for delete to authenticated
  using (current_rol() = 'admin');

-- cursos: lectura para cualquier usuario autenticado; escritura solo admin.
create policy "cursos_select" on cursos for select to authenticated
  using (true);
create policy "cursos_insert_admin" on cursos for insert to authenticated
  with check (current_rol() = 'admin');
create policy "cursos_update_admin" on cursos for update to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');
create policy "cursos_delete_admin" on cursos for delete to authenticated
  using (current_rol() = 'admin');

-- horarios: lectura para todos (README: "Todos"); escritura solo admin.
create policy "horarios_select" on horarios for select to authenticated
  using (true);
create policy "horarios_insert_admin" on horarios for insert to authenticated
  with check (current_rol() = 'admin');
create policy "horarios_update_admin" on horarios for update to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');
create policy "horarios_delete_admin" on horarios for delete to authenticated
  using (current_rol() = 'admin');

-- estudiantes: admin ve/edita todo; profesor ve los de sus cursos asignados;
-- estudiante/acudiente ve únicamente su propio registro. Matrículas
-- (README) es un módulo exclusivo de Administrador para escritura.
create policy "estudiantes_select" on estudiantes for select to authenticated
  using (
    current_rol() = 'admin'
    or "cursoId" = any (mis_cursos())
    or id = current_ref_id()
  );
create policy "estudiantes_write_admin" on estudiantes for insert to authenticated
  with check (current_rol() = 'admin');
create policy "estudiantes_update_admin" on estudiantes for update to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');
create policy "estudiantes_delete_admin" on estudiantes for delete to authenticated
  using (current_rol() = 'admin');

-- asistencia: admin todo; profesor lee/escribe la de sus cursos; estudiante
-- solo lee la propia.
create policy "asistencia_select" on asistencia for select to authenticated
  using (
    current_rol() = 'admin'
    or "cursoId" = any (mis_cursos())
    or "estudianteId" = current_ref_id()
  );
create policy "asistencia_insert" on asistencia for insert to authenticated
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "asistencia_update" on asistencia for update to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()))
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "asistencia_delete" on asistencia for delete to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));

-- notas: admin todo; profesor lee/escribe las de sus cursos; estudiante solo
-- lee las propias (README: registro Admin/Profesor, lectura "Todos").
create policy "notas_select" on notas for select to authenticated
  using (
    current_rol() = 'admin'
    or "cursoId" = any (mis_cursos())
    or "estudianteId" = current_ref_id()
  );
create policy "notas_insert" on notas for insert to authenticated
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "notas_update" on notas for update to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()))
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "notas_delete" on notas for delete to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));

-- observaciones: mismo patrón que notas; el estudiante solo lee las propias
-- (necesario para que su propio boletín pueda mostrarlas).
create policy "observaciones_select" on observaciones for select to authenticated
  using (
    current_rol() = 'admin'
    or "cursoId" = any (mis_cursos())
    or "estudianteId" = current_ref_id()
  );
create policy "observaciones_insert" on observaciones for insert to authenticated
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "observaciones_update" on observaciones for update to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()))
  with check (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));
create policy "observaciones_delete" on observaciones for delete to authenticated
  using (current_rol() = 'admin' or "cursoId" = any (mis_cursos()));

-- pagos: admin todo; estudiante/acudiente solo lee (y ve el estado de) sus
-- propios pagos. El profesor no tiene acceso (no aparece en el README).
create policy "pagos_select" on pagos for select to authenticated
  using (current_rol() = 'admin' or "estudianteId" = current_ref_id());
create policy "pagos_write_admin" on pagos for insert to authenticated
  with check (current_rol() = 'admin');
create policy "pagos_update_admin" on pagos for update to authenticated
  using (current_rol() = 'admin') with check (current_rol() = 'admin');
create policy "pagos_delete_admin" on pagos for delete to authenticated
  using (current_rol() = 'admin');
