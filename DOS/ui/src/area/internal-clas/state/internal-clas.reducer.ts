import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base InternalClas Interface
export interface InternalClas {
  org_fiscal_id: number;
  direccion_id: number;
  sorting_val: number;
  title: string;
}

export type Catalog = {
  fiscals: Array<CatalogItem> | null,
  divisions: Array<CatalogItem> | null,
};

type CatalogItem = {
  id: number,
  title: string,
};

export interface InternalClasSlice {
  internalClas: InternalClas | null;
  internalClasses: Array<InternalClas> | null;
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

const initialState: InternalClasSlice = {
  internalClas: null,
  internalClasses: null,
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

export const sliceName = 'internalClasSlice';
export const internalClasReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
