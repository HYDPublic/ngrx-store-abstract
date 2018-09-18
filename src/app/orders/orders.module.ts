import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
// Services
import * as fromServices from './services';
// Guards
import * as fromGuards from './guards';
// Container
import * as fromContainers from './containers';
// Components
import * as fromComponents from './components';

import { ListModule } from './../list/list.module';
import { ListGuard } from './../list/guards/list-guard';
import * as modProperties from './mod-properties';

const routes: Routes = [
{
  path: '',
  component: fromContainers.OrdersComponent,
  data: {store: modProperties.storeName, modName: modProperties.modName},
  canActivate: [ListGuard]
},
{
  path: ':orderId',
  component: fromContainers.OrderComponent,
  pathMatch: 'full'
}];

@NgModule({
  imports: [
    ListModule.forRoot(),
    RouterModule.forChild(routes),
    StoreModule.forFeature(modProperties.storeName, reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  providers: [...fromServices.services,  ...fromGuards.guards],
})


export class OrdersModule { }
