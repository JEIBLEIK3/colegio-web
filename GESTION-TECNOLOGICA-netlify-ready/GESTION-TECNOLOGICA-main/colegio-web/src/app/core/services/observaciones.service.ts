import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Observacion } from '../models/models';
import { SEED_OBSERVACIONES } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class ObservacionesService extends EntityService<Observacion> {
  constructor() {
    super('observaciones', SEED_OBSERVACIONES);
    this.load();
  }
}
