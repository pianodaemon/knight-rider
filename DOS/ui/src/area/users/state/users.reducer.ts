import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface User {
  id: number;
  username: string;
  passwd: string;
  orgchart_role_id: number;
  division_id: number;
  disabled: boolean;
  access_vector: Array<any>;
  first_name: string;
  last_name: string;
}

interface UserSlice {
  user: User | null;
  users: Array<User> | null;
  loading: boolean;
  catalog: Catalog | null;
  paging: {
    count: number,
    pages: number,
    page: number,
    per_page: number,
    order: string,
    order_by: string,
  };
}

export type Catalog = {
  divisions: Array<Division>,
  orgchart_roles: Array<OrgchartRoles>,
  authorities: Array<{ id: number, description: string }>,
};

type CatalogItem = {
  id: number,
  title: string,
};

type Division = CatalogItem;
type OrgchartRoles = CatalogItem;

const initialState: UserSlice = {
  user: null,
  users: null,
  loading: false,
  catalog: null,
  paging: {
    count: 0,
    pages: 0,
    page: 1,
    per_page: 5,
    order: 'desc',
    order_by: 'id',
  },
};

export const sliceName = 'userSlice';
export const userReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
