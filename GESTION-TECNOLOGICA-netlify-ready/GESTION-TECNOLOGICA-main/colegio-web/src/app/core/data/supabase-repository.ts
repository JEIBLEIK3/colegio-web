import { Observable, from } from 'rxjs';
import { Repository } from './repository';
import { supabase } from './supabase-client';

/**
 * Repositorio real sobre Supabase (Postgres + PostgREST). Cada `resource`
 * es directamente el nombre de la tabla (ver supabase/migrations); RLS en
 * la base de datos hace el control de acceso por rol, no este repositorio.
 * Se activa cuando `environment.useMockData = false` y
 * `environment.backend = 'supabase'` (ver repository-factory.ts).
 */
export class SupabaseRepository<T extends { id: string }> implements Repository<T> {
  constructor(private readonly table: string) {}

  getAll(): Observable<T[]> {
    return from(
      supabase
        .from(this.table)
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? []) as T[];
        })
    );
  }

  getById(id: string): Observable<T | undefined> {
    return from(
      supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) throw error;
          return (data ?? undefined) as T | undefined;
        })
    );
  }

  create(item: T): Observable<T> {
    return from(
      supabase
        .from(this.table)
        .insert(item as never)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as T;
        })
    );
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    return from(
      supabase
        .from(this.table)
        .update(changes as never)
        .eq('id', id)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) throw error;
          return data as T;
        })
    );
  }

  remove(id: string): Observable<void> {
    return from(
      supabase
        .from(this.table)
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error;
        })
    );
  }
}
