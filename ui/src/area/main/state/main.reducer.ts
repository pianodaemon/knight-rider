import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

interface MainSlice {
  openNotificationSnackbar: boolean;
}

const initialState: MainSlice = {
  openNotificationSnackbar: false,
};

export const sliceName = 'mainSlice';
export const mainReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
