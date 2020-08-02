/**
 * Combine all reducers in this file and export the combined reducer.
 * If we were to this in store.ts, reducers wouldn't be hot reloadable.
 *
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

export function createRootReducer(asyncReducers: any): any {
  return combineReducers({
    router: connectRouter(asyncReducers),
    ...asyncReducers,
  });
}
