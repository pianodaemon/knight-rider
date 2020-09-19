import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Results Report CYTG Interface
export interface Credentials {
  username: string;
  password: string;
}

export interface JWT {
  token: string; // raw Base64 encoded token
  header?: { [key: string]: string }; // decoded header
  payload?: { [key: string]: string }; // decoded payload
  signature?: string; // decoded signature
}

interface AuthSlice {
  error: any;
  loading: boolean;
  profile: any | null,
  refreshing: boolean,
  signedIn: boolean,
  token: JWT | null;
}

const initialState: AuthSlice = {
  error: null,
  loading: false,
  profile: null,
  refreshing: false,
  signedIn: false,
  token: null,
};

export const sliceName = 'authSlice';
export const authReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
