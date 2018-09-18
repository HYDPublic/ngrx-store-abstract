import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { listReducer, ListState } from '../../list/store/list.reducer';
import * as modProperties from '../mod-properties';

export interface ManageOrdersState { list: any; }

export const reducers: ActionReducerMap<any> = {
  list: listReducer(modProperties.storeName, modProperties.modName)
};

