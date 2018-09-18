import { NgModule } from '@angular/core';
import { ListEffects } from './store/list.effects';
import { ListGuard } from './guards/list-guard';

@NgModule({
  imports: [],
  declarations: [],
  providers: [],
  exports: []
})

export class ListModule {  static forRoot() {
  return {
    ngModule: ListModule,
    providers: [ListEffects, ListGuard]
  };
}}
