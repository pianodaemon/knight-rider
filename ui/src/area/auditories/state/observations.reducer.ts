import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Observation {
  id: number;
  observation_type_id: number;
  social_program_id: number;
  audit_id: number;
}

interface ObservationsSlice {
  observations: Array<Observation> | null;
  catalog: Catalog | null;
  loading: boolean;
}

type CatalogItem = {
  id: number,
  title: string,
};

type Audit = {
  id: number,
  title: string,
  dependency_id: number
};

export type Catalog = {
  observation_types: Array<CatalogItem> | null,
  social_programs: Array<CatalogItem> | null,
  audits: Array<Audit> | null,
};

const initialState: ObservationsSlice = {
  observations: null,
  catalog: null,
  loading: false,
};

export const sliceName = 'observationsSlice';
export const observationsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
