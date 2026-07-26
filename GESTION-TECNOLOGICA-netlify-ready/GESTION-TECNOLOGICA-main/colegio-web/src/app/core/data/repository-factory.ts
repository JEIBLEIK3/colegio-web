import { HttpClient } from '@angular/common/http';
import { Repository } from './repository';
import { StorageRepository } from './storage-repository';
import { HttpRepository } from './http-repository';
import { SupabaseRepository } from './supabase-repository';
import { environment } from '../../../environments/environment';

/**
 * Punto único de decisión mock vs. backend real. Cambiar
 * `environment.useMockData` a `false` (o desplegar con environment.prod.ts)
 * redirige toda la app hacia Supabase o AWS (según `environment.backend`)
 * sin modificar los servicios de cada módulo.
 */
export function createRepository<T extends { id: string }>(
  http: HttpClient,
  resource: string,
  seed: T[] = []
): Repository<T> {
  if (environment.useMockData) {
    return new StorageRepository<T>(resource, seed);
  }
  return environment.backend === 'supabase'
    ? new SupabaseRepository<T>(resource)
    : new HttpRepository<T>(http, resource);
}
