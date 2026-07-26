import { Observable } from 'rxjs';

/**
 * Contrato de acceso a datos usado por todos los módulos.
 *
 * Cada entidad (Estudiante, Profesor, Nota, ...) se trata como una "tabla"
 * independiente, tal como sería una tabla DynamoDB con Partition Key = id.
 * Hoy la implementación es `StorageRepository` (localStorage). El día que el
 * backend AWS esté desplegado, basta con inyectar `HttpRepository`, que llama
 * a API Gateway -> Lambda -> DynamoDB, sin tocar ningún componente.
 * Ver ARQUITECTURA_AWS.md.
 */
export interface Repository<T extends { id: string }> {
  getAll(): Observable<T[]>;
  getById(id: string): Observable<T | undefined>;
  create(item: T): Observable<T>;
  update(id: string, item: Partial<T>): Observable<T>;
  remove(id: string): Observable<void>;
}
