import { Component, OnInit, Input, Output, OnChanges, EventEmitter, SimpleChanges, ViewChild, DoCheck   } from '@angular/core';
import { ColumnSetting } from './column-settings-model';
import { FilterParam } from './filter-param';
import { FilterMetadata, TieredMenu, OverlayPanel, DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit , OnChanges    {

  @Input()  records: any[];
  @Input()  totalRecords: number;
  @Output()  rowClicked: EventEmitter<any> = new EventEmitter();

  // @Input() dataProvider: AbstractDataProvider;
  @Input() settings: ColumnSetting[];
  @Input() selectedColumns: any[];
  @Input() selectionMode: string;
  @Input() primaryKey: string;
  @Input() enableRowEditButton: boolean;
  @Input() enableRowDeleteButton: boolean;
  @Input() filtersCookieKeyName: string;
  @Input() offset: number;
  @Input() preFilterParams: FilterParam[];
  @Input() defaultSortColumn: string;
  @Input() loading: boolean;

  @Output() preFilterParamsChange: EventEmitter<FilterParam[]> = new EventEmitter<FilterParam[]>();
  @Output() loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Output() editRecord: EventEmitter<any> = new EventEmitter();
  @Output() deleteRecord: EventEmitter<any> = new EventEmitter();
  @Output() selectedRecords: EventEmitter<any> = new EventEmitter();
  @Output() recordActionList: EventEmitter<any> = new EventEmitter();
  @Output() rowButton: EventEmitter<string> = new EventEmitter();
  @Output() selectedColumnsEmit: EventEmitter<any[]> = new EventEmitter<any[]>();

  @ViewChild('table') table: DataTable;

  // lazyLoadRequestSubject: Subject<LazyLoadRequest> = new Subject<LazyLoadRequest>();
  // lastLazyLoadRequest: LazyLoadRequest;
  dtFilters: {[s: string]: FilterMetadata} = {};

  filters: any [] = [];
  columnOptions: any[];
  selectedRecordData: any;
  filterDropDowns: any[] = [];
  rowStyleClass = false;
  customFilterMap: any = {}; // Used to clearing all custom filters
  stackedDatatableMode = false;
  private initialSearch = true;
  maxval = 2;
  selectedCol: any[];

  // @Input() offset: number;
  @Input() rowsNum: number;
  @Input() filtersFields: any;
  // @Input() loading: boolean;
  @Output()  filtersFieldsEmit: EventEmitter<any> = new EventEmitter();
  @Output()  rowsNumEmit: EventEmitter<any> = new EventEmitter();
  @Output()  offestEmit: EventEmitter<any> = new EventEmitter();
  @Output() rowDoubleClicked: EventEmitter<any> = new  EventEmitter();
  constructor() {
    // time to delay search
   }

  ngOnInit() {
    // HACK: Force stacked datatable mode if a small screen is detected
    if (window.innerWidth <= 768) {
        this.stackedDatatableMode = true;
    }
    if (this.selectionMode === 'multiple') {
      this.selectedRecordData = [];
    }
    // 800ms
    this.table.filterDelay = 800;
    this.dtFilters = this.filtersFields || {};
    this.preSetCustomMap();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedColumns != null) {
      const filteredCol = changes.selectedColumns.currentValue.filter(col => col.viewCol === true);
      this.selectedColumns = filteredCol;
      this.preSetCustomMap();
    }
    if (changes.filtersFields != null) {
      this.dtFilters = changes.filtersFields.currentValue;
      this.preSetCustomMap();
    }
  }

  preSetCustomMap(): void {
  if (this.selectedColumns && this.dtFilters && Object.keys(this.dtFilters).length > 0) {
      this.selectedColumns.forEach(setting => {
        if (this.dtFilters[setting.primaryKey]) {
          const pkVal = this.dtFilters[setting.primaryKey].value;
          this.customFilterMap[setting.primaryKey] = (setting.format === 'date') ?  new Date(pkVal) : pkVal;
        }
      });
    }
  }

// HACK: parent div's resize event is bound to this function. It'll turn the datatable into stacked mode once the
// screen width is <= 768. Replace once PrimeNG allows for specifying the breakpoint before going into stacked mode
// for the responsive property
  onViewportChange() { this.stackedDatatableMode = window.innerWidth <= 768; }

   tableReset() {
    this.table.reset();
    this.table.updatePaginator() ;
    this.selectedRecordData = [];
  }
  setCurrentPage(n: number) {
    // n = (n + this.table.rows) / 10;
    const paging = {
      first: n,
      rows: this.table.rows
    };
    // this.table.paginate(paging);
  }



  createDropDowns(data: any): void {
    let column = null;
    for (let i = 0 ; i < data.length; i ++) {
         column = this.settings.find(x => x.primaryKey === data[i].primaryKey);
         if (column.dropDown === true) {
          this.filterDropDowns.push();
         }

        // if(this.data[])
        // this.filterDropDowns.push({this.data})
    }

  }



  selectedRow($event, rowData?) {
    console.log(this.primaryKey);
    if ($event.type === 'row' && this.selectionMode === 'multiple') {

      let removeIndex = -1;

      for (let i = 0 ; i < this.selectedRecordData.length ; i++) {
          if (this.selectedRecordData[i][this.primaryKey] === $event.data[this.primaryKey]) {
            removeIndex = i;
            break;
          }
      }

      if (removeIndex !== -1) {
        this.selectedRecordData.splice(removeIndex, 1);
      } else {
        this.selectedRecordData.push($event.data);
      }
    }
    if ($event.type === 'row' && this.selectionMode === 'single') {
      this.selectedRecordData = $event.data;
    }
    if ($event.type === 'click') {
      this.selectedRecordData = rowData;
    }
    if ($event.type === 'dblclick') {
      this.selectedRecordData = rowData;
    }
  }

  isDropDownField(fieldName: any): boolean {
    if (fieldName.dropDown != null) {
      return true;
    } else {
      return false;
    }
  }


  changeSelectedColumns($event) {
    console.log($event.value);
    this.selectedColumnsEmit.emit(this.selectedColumns);

  }

  onRowClicked($event) {
    this.selectedRow($event);
    this.rowClicked.emit(this.selectedRecordData);
  }
  onRowDoubleClicked($event, rowData?) {
    this.selectedRow($event, rowData);
    this.rowDoubleClicked.emit(this.selectedRecordData);
  }

  editRecordData(data: any) {
    this.editRecord.emit(data);
  }

  deleteRecordData(data: any) {
    this.deleteRecord.emit(data);
  }

  YesNoConvert(rowData: any): string {
    if (rowData === true) {
      return 'Yes';
    } else {
      return 'No';
    }
  }

  setSettings(settings: any): void {
    this.settings = settings;
  }

  getData(name: string, rowData: any): any {
      if (rowData == null) {
          return '';
      }
        const refs = name.split('.');

        if ( refs.length > 0 && refs.length === 1) {
            if (rowData[refs[0]] instanceof Array) {
                return rowData[refs[0]].join(', ');
            } else {
                return rowData[refs[0]];
            }
        } else {
          return this.getData(refs.splice(1).join('.'), rowData[refs[0]]);
        }

  }



  selectMenuItem(event, rowdata, menu: TieredMenu) {
    this.selectedRow(event, rowdata);
   // this.orderRequestService.selectedOrderRequest = orderReq;
    menu.toggle(event);
  }

  selectedButton(label, rowdata) {
    this.selectedRecordData = rowdata;
    this.rowClicked.emit(this.selectedRecordData);
    this.rowButton.emit(label);

  }

  recordActionListMenuSelection(event) {
    this.recordActionList.emit(event.item.label);
  }

  resetFilters(): void {
    this.filtersFields = [];
    this.customFilterMap = {};
    this.dtFilters = {};
    this.table.reset();
  }


  getRowCssForState(rowData: any): string {
    if (this.rowStyleClass === true) {

      // return this.dataProvider.getRowStyleCss(rowData);
      return '';
    } else {
      return '';
    }
  }

  onCalendarInput(event, field: string) {
    if (event.data != null) {
        return;
    }
  }

  displayRules(col, rowData): any {
    return false;
  }

  filter($e) {
    this.filtersFieldsEmit.emit({ filters: $e.filters, sort: {field: this.table.sortField, order: this.table.sortOrder} });
  }

  page($e) {
    this.offestEmit.emit($e);
  }

  sort($e) {
    this.filtersFieldsEmit.emit({ filters:  this.table.filters, sort: {field: this.table.sortField, order: this.table.sortOrder} });
  }

  showSelectCol(event, d, overlaypanel: OverlayPanel) {
    this.selectedCol = d;
    overlaypanel.toggle(event);
  }

  isString(v) {
    return typeof v === 'string';
  }
}

