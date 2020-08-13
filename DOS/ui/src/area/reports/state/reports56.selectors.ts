import { createSelector } from 'reselect';
import { result56Reducer } from './reports56.reducer';

const sliceSelector = (state: any) => state[result56Reducer.sliceName];

export const report56Selector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
