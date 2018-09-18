import { OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppInjector } from './../../../services/app-injector.service';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { IQuery, IField } from './../../models/query.model';
import * as ba from './../../services/utiity';
import { RecordListComponent } from '../../../components/record-list';

export abstract class ListComponent implements OnInit, AfterViewInit {
  selectionMode: string;
  moduleName: string;
  settings: any[];
  primaryKey: string;

  data$: Observable<any>;
  query$: Observable<IQuery>;
  loading$: Observable<boolean>;
  data: any[];
  query: IQuery;

  private router: Router;
  private store: Store<any>;
  // private listService: ListService;
  private resolver: ComponentFactoryResolver;
  storeName: string;
  componentRef: ComponentRef<RecordListComponent>;
  filters: any;

  @ViewChild('recordListcontainer', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(private obj: any) {
    // Manually retrieve the dependencies from the injector
    // so that constructor has no dependencies that must be passed in from child
    const injector = AppInjector.getInjector();
    this.router = injector.get(Router);
    this.store = injector.get(Store);
    this.resolver = injector.get(ComponentFactoryResolver);

    if (obj) {
      this.settings = obj.settings;
      this.primaryKey = obj.primaryKey;
      this.selectionMode = obj.selectionMode;
      this.moduleName = obj.moduleName;
      this.storeName = obj.storeName;
    }
  }

  ngAfterViewInit() {
    // Create component dynamically
    this.createComponent();
  }

  ngOnInit() {
    this.data$ = this.store.select(a => a[this.storeName].list);
    // this.query$ = this.store.select(a => a[this.storeName].list.query);
    this.loading$ = this.store.select(a => a[this.storeName].list.loading);
  }

  createComponent() {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(RecordListComponent);
    this.componentRef = this.entry.createComponent(factory);

    // [records]="(data$ | async)"
    // [totalRecords]="getTotalRecords((data$ | async), (query$ | async)?.maxResults, (query$ | async)?.offset)"
    // [rowsNum] = "(query$ | async)?.maxResults"
    // [offset] = "(query$ | async)?.offset"
    // [selectionMode] = "selectionMode"
    // [settings]= "settings"
    // [selectedColumns] = "settings"
    // [primaryKey] = "primaryKey"
    // [loading]= "loading$ | async"

    // Inputs
    this.componentRef.instance.settings = this.settings;
    this.componentRef.instance.selectionMode = this.selectionMode;
    this.componentRef.instance.selectedColumns = this.settings;
    this.componentRef.instance.primaryKey = this.primaryKey;

    this.loading$.subscribe(loading => {
      this.componentRef.instance['loading'] = loading;
      this.detectChanges();
    });

    combineLatest([this.data$]).subscribe((value: [any]) => {
      this.data = Object.keys(value[0].entities).map(id => value[0].entities[id]); // data selector
      this.query = value[0].query; // query selector

      this.componentRef.instance['records'] = this.data;
      this.componentRef.instance['rowsNum'] = this.query.maxResults;
      this.componentRef.instance['offset'] = this.query.offset;
      this.componentRef.instance.totalRecords = this.getTotalRecords(this.data, this.query.maxResults, this.query.offset);
      this.detectChanges();
    });

    // (rowClicked) = "rowClicked($event)"
    // (rowDoubleClicked) = "rowDoubleClicked($event)"
    // (offestEmit) = "offestEvent($event)"
    // (rowsNumEmit) = "rowNumEvent($event)"
    // (filtersFieldsEmit) = "filtersFieldsEvent($event)"
    // outputs
    this.componentRef.instance.rowClicked.subscribe(val => this.rowClicked(val));
    this.componentRef.instance.rowDoubleClicked.subscribe(val => this.rowDoubleClicked(val));
    this.componentRef.instance.offestEmit.subscribe(val => this.offestEvent(val));
    this.componentRef.instance.rowsNumEmit.subscribe(val => this.rowNumEvent(val));
    this.componentRef.instance.filtersFieldsEmit.subscribe(val => this.filtersFieldsEvent(val));
  }

  detectChanges() {
    this.componentRef.changeDetectorRef.detectChanges();
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  getTotalRecords(data: any[], rows: number, offset: number): number {
    const resultSize = data.length;
    return ((resultSize === 0) || (resultSize > 0 && resultSize < rows)) ?
      offset + rows : offset + rows + resultSize;
  }

  rowClicked($event): void {
   // single Click
  }

  rowDoubleClicked($event): void {
    if (this.selectionMode === 'multiple') {
      // you have an array of user data in event

    } else {
      // you have a single user data as event
      this.router.navigate([this.moduleName.toLowerCase(), $event.id]);
    }
  }

  offestEvent($event: {first: number, rows: number}): void {
    //
    const offset = $event.first === this.query.offset ? 0 : $event.first;
    const maxResults = $event.rows;
    this.query = {
      ...this.query,
      offset,
      maxResults
    };
    this.dispatchLoadList();
  }

  filtersFieldsEvent($event): void {
    const fields = Object.keys($event.filters).reduce((arr, item) => {
      const updatedItem = {
        name: item,
        searchItems: [$event.filters[item].value],
        sortOrder: null
      };
      arr.push(updatedItem);
      return arr;
      }, []);

      if ($event.sort && $event.sort.field) {
        const fieldIndex = fields.findIndex(field => field.name === $event.sort.field);
        if (fieldIndex > -1) {
          fields[fieldIndex].sortOrder = ($event.sort.order === 1 ? 'ASC' : 'DESC');
        } else {
          fields.push({
            name: $event.sort.field,
            searchItems: [],
            sortOrder: ($event.sort.order === 1 ? 'ASC' : 'DESC')
          });
        }
      }

    // fields.push({name: 'pkgDueDateFrom', searchItems: ['2019-10-02'], sortOrder: null});
    this.query = {
      ...this.query,
      fields,
      offset: 0
    };
    this.updateList(this.filters);
  }

  updateList($filter: {items: IField[], columns: any[]}): void {
    if ($filter) {
      this.filters = $filter;
      $filter.items.forEach(item => {
        const filterItemIndex = this.query.fields.findIndex(queryField => queryField.name === item.name);
        if (filterItemIndex > -1) {
          this.query.fields[filterItemIndex].searchItems = item.searchItems;
        } else {
          this.query.fields.push(item);
        }
      });
    }
    this.dispatchLoadList();
  }

  rowNumEvent($event): void {
    console.log('rowsNumEvent ', $event);
  }

  clearFilters() {
    this.query = {
      ...this.query,
      fields: [],
      offset: 0,
      maxResults: 10
    };
    this.dispatchLoadList();
  }

  dispatchLoadList() {
    const action = ba.buildAction(this.query, this.moduleName, this.storeName, 'loadList', ba.buildType);
    this.store.dispatch(action);
  }
}
