import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Dependency Interface
export interface Dependency {
  id: number;
  title: string;
  description: string;
  clasif_id: number;
}

export type Catalog = {
  dependencia_clasif: Array<CatalogItem> | null,
};

type CatalogItem = {
  id: number,
  title: string,
};

export interface DependenciesSlice {
  dependency: Dependency | null;
  dependencies: Array<Dependency> | null;
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

const initialState: DependenciesSlice = {
  dependency: null,
  dependencies: null,
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

export const sliceName = 'dependenciesSlice';
export const dependenciesReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
