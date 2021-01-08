import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Status Interface
export interface Status {
  id: number;
  org_fiscal_id: number;
  pre_ires: string;
  title: string;
}

export type Catalog = {
  fiscals: Array<CatalogItem> | null,
};

type CatalogItem = {
  id: number,
  title: string,
};

export interface StatusSlice {
  status: Status | null;
  statuses: Array<Status> | null;
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

const initialState: StatusSlice = {
  status: null,
  statuses: null,
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

export const sliceName = 'statusSlice';
export const statusReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
