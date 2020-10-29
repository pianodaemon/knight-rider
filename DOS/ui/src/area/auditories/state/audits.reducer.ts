import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Audit Interface
export interface Audit {
  id: number;
  title: string;
  dependency_ids: Array<number>;
  years: Array<number>;
}

// Mutated Audit Interface to be used as a Request body on Create/Update Actions
// export interface AuditRequest extends Audit {}

export type Catalog = {
  dependencies: Array<Dependency> | null,
};

export type Dependency = {
  id: number,
  title: string,
  description: string,
};

export interface AuditsSlice {
  audit: Audit | null;
  audits: Array<Audit> | null;
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

const initialState: AuditsSlice = {
  audit: null,
  audits: null,
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

export const sliceName = 'auditsSlice';
export const auditsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
