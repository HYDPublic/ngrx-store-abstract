import { Injectable } from '@angular/core';

import { Actions } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';

import * as fromRoot from './../../store';
import { Store, Action } from '@ngrx/store';
import { IQuery } from './../models/query.model';
import * as ba from './../services/utiity';

@Injectable()
export class ListEffects {
  constructor(private actions$: Actions, private store: Store<any>) {}
  // this.le.fetch(ordersActions, this.ordersService, 'orders');
  fetch(service, storeName, modName) {
    // const loadList = actions[`LOAD_${type.toUpperCase()}`];
    const loadList = ba.buildType('loadList', storeName, modName);
    const fn: Observable<Action> = this.actions$
      .ofType(loadList)
      .pipe(
        map((action: any): IQuery => action.payload),
        switchMap((query: IQuery): Observable<any> => {
          // Dispatch loading screen event to root store
          this.store.dispatch(new fromRoot.Loading);
          const req$ = service.getData(query).pipe(
            // Dispatch Loaded screen event to root store upon completion of orderService request
            tap((): void => this.store.dispatch(new fromRoot.Loaded)),
            map((data: {entities: any[]}): any => {
              const ret = ba.buildAction({data: data.entities, query: query}, modName, storeName, 'loadListSuccess', ba.buildType);
              return ret;
            }),
            catchError((error: any): Observable<any> => of(ba.buildAction(error, modName, storeName, 'loadListFail', ba.buildType)))
          );
          return req$;
        })
      );
    return fn;
  }
}
