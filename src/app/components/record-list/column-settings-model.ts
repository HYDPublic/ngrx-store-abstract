import { SelectItem } from 'primeng/primeng';
  export class ColumnSetting {
    primaryKey: string;
    header?: string;
    format?: string;
    alternativeKeys?: string[];
    filter?: boolean;
    sortable?: boolean;
    viewCol?: boolean;
    buttons?: any[];
    dropDown?: boolean;
    dropDownMulti?: boolean;
    dropDownData?: SelectItem[];
    otherPrimaryKey?: string;
    secondFormat?: string;
    rowFilter?: any;
    buttonLabel?: string;
    hidden?: boolean;
    dropDownDate?: boolean;
}
