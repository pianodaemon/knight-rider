import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface User {
  id: number;
  username: string;
  passwd: string;
  orgchart_role_id: number;
  division_id: number;
  disabled: boolean;
}

interface UserSlice {
  user: User | null;
}

const initialState: UserSlice = {
  user: null,
};

export const sliceName = 'userSlice';
export const userReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
