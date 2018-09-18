
export const buildAction = (payload: any, modName: string, storeName: string, actionType: string, bt): {payload: any, type: string} => {
  const type = bt(actionType, storeName, modName);
  return {payload, type};
};


export const getAllActionTypes = (storeName, modName, bt) => {
  return {
    loadList: bt('loadList', storeName, modName),
    loadListSuccess: bt('loadListSuccess', storeName, modName),
    loadListFail: bt('loadListFail', storeName, modName),
    updateListQuery: bt('updateListQuery', storeName, modName),
    resetListQuery: bt('resetListQuery', storeName, modName)
  };
};


export const buildType = (actionType: string, storeName: string, modName: string) => {
  let type = '';
  modName = modName.toLowerCase();
  switch (actionType) {
    case 'loadList':
      type = `[${storeName}] Load ${modName}`; // [manageOrders] Load Orders;
      break;

    case 'loadListFail':
      type = `[${storeName}] Load ${modName} Fail`; // [manageOrders] Load Orders;
      break;

    case 'loadListSuccess':
      type = `[${storeName}] Load ${modName} Success`;
      break;

    default:
      type = ``;
      break;
  }
  return type;
};
