import { createSelector } from 'reselect';
import { result61Reducer } from './reports61.reducer';

const sliceSelector = (state: any) => state[result61Reducer.sliceName];

export const report61Selector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
