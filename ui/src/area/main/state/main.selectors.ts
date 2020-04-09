import { createSelector } from 'reselect';
import { mainReducer } from './main.reducer';

const sliceSelector = (state: any) => state[mainReducer.sliceName];

export const notificationSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.snackbarNotifier
);
