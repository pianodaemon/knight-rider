import { createSelector } from 'reselect';
import {
  authReducer,
  JWT,
} from './auth.reducer';

const sliceSelector = (state: any) => state[authReducer.sliceName];

export const authTokenSelector = createSelector(
  sliceSelector,
  (slice: any): JWT => slice.token
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any): boolean => slice.loading
);