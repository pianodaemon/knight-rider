import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Results Report CYTG Interface
export interface Credentials {
  username: string;
  password: string;
}

export interface JWT {
  token: string
}

interface AuthSlice {
  error: any;
  loading: boolean;
  token: JWT | null;
}

const initialState: AuthSlice = {
  error: null,
  loading: false,
  token: null,
};

export const sliceName = 'authSlice';
export const authReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
