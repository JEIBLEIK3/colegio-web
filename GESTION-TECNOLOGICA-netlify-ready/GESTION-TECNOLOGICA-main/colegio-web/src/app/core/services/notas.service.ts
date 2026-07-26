import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Nota } from '../models/models';
import { SEED_NOTAS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class NotasService extends EntityService<Nota> {
  constructor() {
    super('notas', SEED_NOTAS);
    this.load();
  }
}
