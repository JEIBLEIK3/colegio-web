import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository } from './repository';
import { environment } from '../../../environments/environment';

/**
 * Repositorio real: consume la API REST expuesta por API Gateway, que a su
 * vez invoca funciones Lambda con acceso a DynamoDB (una tabla por recurso).
 * Se activa automáticamente cuando `environment.useMockData = false`.
 * El token de autorización (JWT de Cognito) lo añade `authInterceptor`.
 *
 * Recurso esperado en API Gateway: /{resource} -> GET, POST
 *                                   /{resource}/{id} -> GET, PATCH, DELETE
 */
export class HttpRepository<T extends { id: string }> implements Repository<T> {
  constructor(private readonly http: HttpClient, private readonly resource: string) {}

  private get url(): string {
    return `${environment.aws.apiBaseUrl}/${this.resource}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  getById(id: string): Observable<T | undefined> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.url, item);
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.url}/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
