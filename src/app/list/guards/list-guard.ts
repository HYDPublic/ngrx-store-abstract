import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { tap, filter, take, switchMap, catchError, map } from 'rxjs/operators';

// import { AppInjector } from '@app/core/services/app-injector.service';
import * as ba from './../services/utiity';
import { AppInjector } from '../../services/app-injector.service';

@Injectable()
export class ListGuard implements CanActivate {
  private store: Store<any>;
  constructor() {
    const injector = AppInjector.getInjector();
    this.store = injector.get(Store);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.checkStore(route.data.store, route.data.modName).pipe(
      switchMap((): Observable<boolean> => {
        return of(true);
      }),
      catchError((): Observable<boolean> => {
        return of(false);
      })
    );
  }

  /**
   * Preload data from API if we haven't visited before,
   * Otherwise, use existing state in store.
   *
   * @param {}
   * @returns Observable
   */
  checkStore(storeName: string, modName: string): Observable<boolean> {
    return this.store.select(a => a[storeName].list.loaded).pipe(
      tap((loaded: boolean): void => {
        if (!loaded) {
          const sub = this.store.select(a => a[storeName].list.query).subscribe(q => {
            const action = ba.buildAction(q, modName, storeName, 'loadList', ba.buildType);
            this.store.dispatch(action);
          });
          sub.unsubscribe();
        }
      }),
      filter((loaded: boolean): boolean => loaded),
      take(1)
    );
  }
}
