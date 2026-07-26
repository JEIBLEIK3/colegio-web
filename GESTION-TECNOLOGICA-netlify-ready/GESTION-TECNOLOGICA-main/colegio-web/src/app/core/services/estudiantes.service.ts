import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Estudiante } from '../models/models';
import { SEED_ESTUDIANTES } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class EstudiantesService extends EntityService<Estudiante> {
  constructor() {
    super('estudiantes', SEED_ESTUDIANTES);
    this.load();
  }
}
