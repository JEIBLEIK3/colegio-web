import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Profesor } from '../models/models';
import { SEED_PROFESORES } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class ProfesoresService extends EntityService<Profesor> {
  constructor() {
    super('profesores', SEED_PROFESORES);
    this.load();
  }
}
