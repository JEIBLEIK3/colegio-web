import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Repository } from './repository';

/**
 * Repositorio simulado sobre localStorage. Emula la latencia y el contrato
 * de una tabla DynamoDB accedida vía API Gateway + Lambda, para que el
 * cambio a `HttpRepository` (real AWS) sea transparente para los componentes.
 */
export class StorageRepository<T extends { id: string }> implements Repository<T> {
  private readonly key: string;
  private readonly simulatedLatencyMs = 150;

  constructor(tableName: string, seed: T[] = []) {
    this.key = `colegio_${tableName}`;
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(seed));
    }
  }

  private readAll(): T[] {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  }

  private writeAll(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  getAll(): Observable<T[]> {
    return of(this.readAll()).pipe(delay(this.simulatedLatencyMs));
  }

  getById(id: string): Observable<T | undefined> {
    return of(this.readAll().find(i => i.id === id)).pipe(delay(this.simulatedLatencyMs));
  }

  create(item: T): Observable<T> {
    const items = this.readAll();
    items.push(item);
    this.writeAll(items);
    return of(item).pipe(delay(this.simulatedLatencyMs));
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    const items = this.readAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) {
      return throwError(() => new Error(`Registro ${id} no encontrado`));
    }
    items[idx] = { ...items[idx], ...changes };
    this.writeAll(items);
    return of(items[idx]).pipe(delay(this.simulatedLatencyMs));
  }

  remove(id: string): Observable<void> {
    const items = this.readAll().filter(i => i.id !== id);
    this.writeAll(items);
    return of(void 0).pipe(delay(this.simulatedLatencyMs));
  }
}
