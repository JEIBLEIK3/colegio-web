import { Injectable } from '@angular/core';
import { EntityService } from './entity.service.base';
import { Pago } from '../models/models';
import { SEED_PAGOS } from '../data/seed-data';

@Injectable({ providedIn: 'root' })
export class PagosService extends EntityService<Pago> {
  constructor() {
    super('pagos', SEED_PAGOS);
    this.load();
  }
}
