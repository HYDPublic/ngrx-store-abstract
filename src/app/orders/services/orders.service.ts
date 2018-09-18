import { Injectable } from '@angular/core';
import { ListService } from './../../list/services/list.service';
import { ColumnSetting } from '../../components/record-list';
import { of, Observable } from 'rxjs';

@Injectable()
export class OrdersService extends ListService {
  _settings: ColumnSetting[];
  constructor() {
    super('urlToGetData');
    this._settings = this.buildSettings();
  }

  get settings(): ColumnSetting[] {
    return this._settings;
  }

  getData(q): Observable<any> {
    return of({ entities: [{
      id: 1,
      name: 'Lorem Ipsum'
    }, {
      id: 2,
      name: 'Foo bar'
    }] });
  }

  buildSettings(): ColumnSetting[] {
    return [
      {
        primaryKey: 'id',
        header: 'Id',
        filter: false,
        sortable: true,
        viewCol: true,
        format: 'string',
      },
      {
        primaryKey: 'name',
        header: 'Name',
        filter: false,
        sortable: true,
        viewCol: true,
        format: 'string',
      }
    ];
  }
}
