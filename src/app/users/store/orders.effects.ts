import { Injectable } from '@angular/core';

import { Effect } from '@ngrx/effects';
import * as fromServices from '../services';
import { ListEffects } from '../../list/store/list.effects';
import * as modProperties from '../mod-properties';

@Injectable()
export class UsersEffects {
  constructor(
    private usersService: fromServices.UsersService,
    private le: ListEffects
  ) {}

  @Effect()
  getOrders$ = this.le.fetch(this.usersService, modProperties.storeName, modProperties.modName);
}
