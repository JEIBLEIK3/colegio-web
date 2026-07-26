import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { BloqueHorario } from '../models/models';
import { SEED_HORARIOS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class HorariosService extends EntityService<BloqueHorario> {
  constructor() {
    super('horarios', SEED_HORARIOS);
    this.load();
  }
}
