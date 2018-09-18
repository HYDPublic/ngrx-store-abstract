import { NgModule } from '@angular/core';
// import { SharedModule } from '@app/shared/shared.module';
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
