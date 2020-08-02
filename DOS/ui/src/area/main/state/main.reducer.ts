import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

interface MainSlice {
  snackbarNotifier: SnackbarNotifier;
}

type SnackbarNotifier = {
  isOpen: boolean,
  message: string | null,
  autoHideDuration: number | null,
  type: 'error' | 'info' | 'success' | null,
};

const initialState: MainSlice = {
  snackbarNotifier: {
    isOpen: false,
    message: null,
    autoHideDuration: 5000,
    type: null,
  },
};

export const sliceName = 'mainSlice';
export const mainReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
