import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

export interface Observation {
  id: number;
  observation_type_id: number;
  social_program_id: number;
  audit_id: number;
  fiscal_id: number;
  title: string;
}

interface ObservationsSlice {
  observations: Array<Observation> | null;
  observation: Observation | null;
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
  dependency_id: number,
};

type Fiscal = {
  id: number,
  title: string,
  description: string,
};

export type Catalog = {
  observation_types: Array<CatalogItem> | null,
  social_programs: Array<CatalogItem> | null,
  audits: Array<Audit> | null,
  fiscals: Array<Fiscal> | null,
};

const initialState: ObservationsSlice = {
  observations: null,
  observation: null,
  catalog: null,
  loading: false,
};

export const sliceName = 'observationsSlice';
export const observationsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
