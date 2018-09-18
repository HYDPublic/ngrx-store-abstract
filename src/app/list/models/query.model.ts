export interface IQuery {
  resourceName: string;
  fields: IField[];
  pagination: boolean;
  offset: number;
  maxResults: number;
}

export interface IField {
  name: string;
  searchItems: string[];
  sortOrder: string; // ASC / DESC / NULL
}
