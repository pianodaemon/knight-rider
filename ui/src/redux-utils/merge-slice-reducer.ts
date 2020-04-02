/* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable prettier/prettier */
/* eslint-disable */
let store: any = void 0;
let createRootReducer: any = void 0;
let reducersToAdd: any = void 0;

function merge(): any {
  if (!store) {
    return;
  }

  if (store.asyncReducers === undefined) {
    store.asyncReducers = {};
  }

  if (reducersToAdd) {
    Object.keys(reducersToAdd).forEach((sliceName: string) => {
      const reducer = reducersToAdd[sliceName];

      if (sliceName in store.asyncReducers) {
        if (process.env.NODE_ENV === 'development' && module.hot) {
          store.asyncReducers[sliceName] = reducer;
        } else {
        }
      } else {
        store.asyncReducers[sliceName] = reducer;
      }
    });
    reducersToAdd = undefined;
    store.replaceReducer(createRootReducer(store.asyncReducers));
  }
}

export function initMergeSliceReducer(
  reduxStore: any,
  rootReducerCreator: any,
): void {
  store = reduxStore;
  createRootReducer = rootReducerCreator;
  merge();
}

export function mergeSliceReducer(reducer: any): any {
  reducersToAdd = reducersToAdd || {};
  reducersToAdd[reducer.sliceName] = reducer;
  merge();
  return reducer;
}
