import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { listReducer, ListState } from './../../../list/store/list.reducer';
import * as modProperties from './../../mod-properties';

export interface ManageOrdersState { list: any; }

export const reducers: ActionReducerMap<any> = {
  list: listReducer(modProperties.storeName, modProperties.modName)
};

// export const getState_manageOrders = createFeatureSelector<ManageOrdersState>(modProperties.storeName);
// export const getList_manageOrders = createSelector(getState_manageOrders, (state: ManageOrdersState) => state.list);
// export const getListLoaded_manageOrders = createSelector(getList_manageOrders, (state: ListState) => state.loaded);
// export const getListQuery_manageOrders = createSelector(getList_manageOrders, (state: ListState) => state.query);
// export const
