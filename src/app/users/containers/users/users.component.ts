import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services';
import { ListComponent } from '../../../list/containers';
import * as modProperties from '../../mod-properties';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent extends ListComponent {
  filters: any;
  constructor(private os: UsersService) {
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
