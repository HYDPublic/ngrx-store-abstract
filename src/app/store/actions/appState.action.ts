import { Action } from '@ngrx/store';
export const LOADING = '[App] Loading';
export const LOADED = '[App] Loaded';
export const SET_RIGHTS = '[App] Set Rights';
export const UPDATE_STATUS_BAR = '[App] Update Status Bar';

export class Loaded implements Action {
  readonly type = LOADED;
}

export class Loading implements Action {
  readonly type = LOADING;
}

export class SetRights implements Action {
  readonly type = SET_RIGHTS;
}

export class UpdateStatusBar implements Action {
  readonly type = UPDATE_STATUS_BAR;
  constructor(public payload: any) {}
}

// Action types
export type AppAction =
  | Loading
  | Loaded
  | SetRights
  | UpdateStatusBar;
