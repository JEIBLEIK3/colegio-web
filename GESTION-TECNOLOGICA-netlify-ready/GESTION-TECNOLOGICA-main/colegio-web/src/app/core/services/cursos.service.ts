import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Curso } from '../models/models';
import { SEED_CURSOS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class CursosService extends EntityService<Curso> {
  constructor() {
    super('cursos', SEED_CURSOS);
    this.load();
  }
}
