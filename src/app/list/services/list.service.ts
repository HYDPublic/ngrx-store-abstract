import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ApiService } from '@app/core';
import { IQuery } from './../models/query.model';
import { AppInjector } from './../../services/app-injector.service';

@Injectable()
export abstract class ListService {
  protected _apiUrl: string;
  // private api: ApiService;

  constructor(url: string) {
    const injector = AppInjector.getInjector();
    // this.api = injector.get(ApiService);
    this._apiUrl = url;
  }

  get apiUrl(): string {
    return this._apiUrl;
  }

  // getData(q: IQuery): Observable<any> {
  //   // return this.api.post(this.apiUrl, q);
  // }
}
