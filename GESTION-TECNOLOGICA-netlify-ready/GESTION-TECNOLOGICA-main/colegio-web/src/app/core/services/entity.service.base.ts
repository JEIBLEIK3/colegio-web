import { inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Repository } from '../data/repository';
import { createRepository } from '../data/repository-factory';

/**
 * Base común para los servicios de cada módulo. Expone estado reactivo con
 * signals y delega la persistencia al Repository (mock local o AWS real).
 */
export abstract class EntityService<T extends { id: string }> {
  protected readonly http = inject(HttpClient);
  protected readonly repository: Repository<T>;

  readonly items = signal<T[]>([]);
  readonly loading = signal(false);

  protected constructor(resource: string, seed: T[] = []) {
    this.repository = createRepository<T>(this.http, resource, seed);
  }

  load(): void {
    this.loading.set(true);
    this.repository.getAll().subscribe({
      next: data => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  create(item: T): Observable<T> {
    return this.repository.create(item).pipe(tap(() => this.load()));
  }

  update(id: string, changes: Partial<T>): Observable<T> {
    return this.repository.update(id, changes).pipe(tap(() => this.load()));
  }

  remove(id: string): Observable<void> {
    return this.repository.remove(id).pipe(tap(() => this.load()));
  }
}
