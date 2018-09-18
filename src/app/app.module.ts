import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RecordListComponent } from './components/record-list';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { reducers, effects, CustomSerializer } from './store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// Prime NG
import { AccordionModule, ButtonModule, DropdownModule,
  MenubarModule,
  MultiSelectModule, TabViewModule,
  CalendarModule, DataListModule, DialogModule,
  InputSwitchModule, OverlayPanelModule, TieredMenuModule,
  CheckboxModule, LazyLoadEvent, ListboxModule, PanelModule,
  TooltipModule, SelectButtonModule, FieldsetModule, RadioButtonModule, InputTextModule, SidebarModule  } from 'primeng/primeng';
  import {TableModule} from 'primeng/table';

// this would be done dynamically with webpack for builds
const environment = {
  development: true,
  production: false
};
export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];

const routes: Routes = [
  {
    path: 'orders',
    loadChildren: './orders/orders.module#OrdersModule'
  },
  {
    path: 'users',
    loadChildren: './users/users.module#UsersModule'
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RecordListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    environment.development ? StoreDevtoolsModule.instrument() : [],
    // PrimeNg
   PanelModule,
   SidebarModule,
   AccordionModule,
   InputSwitchModule,
   ButtonModule,
   MultiSelectModule,
   DropdownModule,
   MenubarModule,
   MultiSelectModule,
   TabViewModule,
   CalendarModule,
   DataListModule,
   RadioButtonModule,
   DialogModule,
   OverlayPanelModule,
   CheckboxModule,
   TieredMenuModule,
   TooltipModule,
   SelectButtonModule,
   FieldsetModule,
   InputTextModule,
   TableModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [RecordListComponent],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }]
})
export class AppModule { }
