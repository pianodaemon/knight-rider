import { createSelector } from 'reselect';
import { resultsReducer } from './reports.reducer';

const sliceSelector = (state: any) => state[resultsReducer.sliceName];

export const reportSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
