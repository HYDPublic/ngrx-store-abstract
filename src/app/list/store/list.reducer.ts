import { IQuery } from './../models/query.model';
import * as ba from './../services/utiity';
import { actionCreatorFactory } from 'typescript-fsa';

export interface ListState {
  entities: { [id: string]: any };
  loaded: boolean;
  loading: boolean;
  query: IQuery;
}

export function listReducer (storeName: string, resourceName: string, fields = []) {
  resourceName = resourceName.toLowerCase();
  const defaultQuery: IQuery = {
    resourceName,
    fields: fields,
    pagination: true,
    offset: 0,
    maxResults: 10
  };

  const initialState: ListState = {
    entities: {},
    loaded: false,
    loading: false,
    query: defaultQuery
  };

  // Generate actions
  const actions = ba.getAllActionTypes(storeName, resourceName, ba.buildType);
  const actionCreator = actionCreatorFactory();
  actions.loadList = actionCreator<{query: IQuery}>(actions.loadList);
  actions.loadListFail = actionCreator<{any}>(actions.loadListFail);
  actions.loadListSuccess = actionCreator<{any}>(actions.loadListSuccess);

  return (state: ListState = initialState, action: any) => {
    switch (action.type) {
      case actions.loadList.type: {
        return {
          ...state,
          loading: true
        };
      }

      case actions.loadListSuccess.type: {
        const data = action.payload.data;
        const query = action.payload.query;

        const entities = data.reduce(
          (entitiesPrev: { [id: string]: any }, item: any) => {
            return {
              ...entitiesPrev,
              [item.id]: item
            };
          },
          {}
        );

        return {
          ...state,
          loading: false,
          loaded: true,
          entities,
          query
        };
      }

      case actions.loadListFail.type: {
        return {
          ...state,
          loading: false,
          loaded: false
        };
      }

      case actions.updateListQuery.type: {
        const query = action.payload;
        return {
          ...state,
          query
        };
      }

      case actions.resetListQuery.type: {
        const query = JSON.parse(JSON.stringify(defaultQuery));
        return {
          ...state,
          query
        };
      }

    }
    return state;
  };
}
