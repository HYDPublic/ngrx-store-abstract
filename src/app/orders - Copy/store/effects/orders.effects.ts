import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import * as fromServices from '../../services';
import { ListEffects } from './../../../list/store/list.effects';
import * as modProperties from './../../mod-properties';

@Injectable()
export class OrdersEffects {
  constructor(
    private ordersService: fromServices.OrdersService,
    private le: ListEffects
  ) {}

  @Effect()
  getOrders$ = this.le.fetch(this.ordersService, modProperties.storeName, modProperties.modName);
}
