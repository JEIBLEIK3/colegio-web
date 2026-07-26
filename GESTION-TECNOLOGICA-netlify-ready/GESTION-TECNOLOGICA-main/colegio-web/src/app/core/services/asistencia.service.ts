import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { RegistroAsistencia } from '../models/models';
import { SEED_ASISTENCIA } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class AsistenciaService extends EntityService<RegistroAsistencia> {
  constructor() {
    super('asistencia', SEED_ASISTENCIA);
    this.load();
  }
}
