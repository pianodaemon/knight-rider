import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Action Interface
export interface Action {
  id: number;
  description: string;
  title: string;
  org_fiscal_id: number;
}

export type Catalog = {
  fiscals: Array<CatalogItem> | null,
};

type CatalogItem = {
  id: number,
  title: string,
};

export interface ActionsSlice {
  action: Action | null;
  actions: Array<Action> | null;
  catalog: Catalog | null;
  loading: boolean;
  paging: {
    count: number,
    pages: number,
    page: number,
    per_page: number,
    order: string,
    order_by: string,
  };
}

const initialState: ActionsSlice = {
  action: null,
  actions: null,
  catalog: null,
  loading: false,
  paging: {
    count: 0,
    pages: 0,
    page: 1,
    per_page: 200,
    order: 'desc',
    order_by: 'id',
  },
};

export const sliceName = 'actionsSlice';
export const actionsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
