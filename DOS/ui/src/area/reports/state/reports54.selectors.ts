import { createSelector } from 'reselect';
import { result54Reducer } from './reports54.reducer';

const sliceSelector = (state: any) => state[result54Reducer.sliceName];

export const report54Selector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
