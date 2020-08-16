import { createSelector } from 'reselect';
import { result57Reducer } from './reports57.reducer';

const sliceSelector = (state: any) => state[result57Reducer.sliceName];

export const report57Selector = createSelector(
  sliceSelector,
  (slice: any) => slice.report
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);
