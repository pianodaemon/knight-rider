import { createSelector } from 'reselect';
import { result55Reducer } from './reports55.reducer';

const sliceSelector = (state: any) => state[result55Reducer.sliceName];

export const report55Selector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
