import { createSliceReducer } from './create-slice-reducer';
import { mergeSliceReducer } from './merge-slice-reducer';

/**
 * Creates and merges a new reducer for a given sliceName
 *
 */

export function createAndMergeSliceReducer(
  sliceName: string,
  initialState: any,
  handlers: any
) {
  return mergeSliceReducer(
    createSliceReducer(sliceName, initialState, handlers)
  );
}
