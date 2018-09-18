import { Component, OnInit } from '@angular/core';
import { OrdersService } from './../../services';
import { ListComponent } from './../../../list/containers';
import * as modProperties from './../../mod-properties';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent extends ListComponent {
  filters: any;
  constructor(private os: OrdersService) {
    super({
      settings: os.settings,
      primaryKey: 'id',
      selectionMode: 'single',
      moduleName: modProperties.modName,
      storeName: modProperties.storeName
    });
  }

  filterUpdate() {}

  filterUpdateClear() {}

}
