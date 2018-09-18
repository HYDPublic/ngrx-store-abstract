import * as fromApp from '../actions/appState.action';

export interface IUiRights {
  users: {
    addNew: boolean;
  };
}

export interface AppState {
  loaded: boolean;
  loading: boolean;
  uiRights: IUiRights;
  statusBar?: {
    type: string;
    data: any;
  };
}

export const initialState: AppState = {
  loaded: false,
  loading: false,
  uiRights: {
    users: {
      addNew: false
    }
  }
};

export function reducer(
  state = initialState,
  action: fromApp.AppAction
): AppState {
  switch (action.type) {
    case fromApp.LOADING: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromApp.LOADED: {
      return {
        ...state,
        loading: false,
        loaded: true
      };
    }

    case fromApp.UPDATE_STATUS_BAR: {
      const status = action.payload;
      return {
        ...state,
        statusBar: status
      };
    }
  }
  return state;
}


export const getAppLoaded = (state: AppState) => state.loaded;
export const getAppLoading = (state: AppState) => state.loading;
export const getUiRights = (state: AppState) => state.uiRights;
export const getStatusBar = (state: AppState) => state.statusBar;
