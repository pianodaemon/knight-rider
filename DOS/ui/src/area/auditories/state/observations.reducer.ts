import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation Interface
export interface Observation {
  id: number;
  observation_type_id: number;
  social_program_id: number;
  audit_id: number;
  fiscal_id: number;
  observation_code_id: number;
  observation_bis_code_id: number;
  division_id: number;
  title: string;
  amount_observed: number;
  amounts: Array<Amount>;
  comments: string;
  reception_date: string;
  expiration_date: string;
  doc_a_date: string;
  doc_b_date: string;
  doc_c_date: string;
  doc_a: string;
  doc_b: string;
  doc_c: string;
  dep_response: string;
  dep_resp_comments: string;
  hdr_doc: string;
  hdr_reception_date: string;
  hdr_expiration1_date: string;
  hdr_expiration2_date: string;
}

// Mutated Observation Interface to be used as a Request body on Create/Update Actions
export interface ObservationRequest extends Observation {
  // comments: string;
  projected: number;
  solved: number;
  mutatedAmounts: Array<any>;
}

export type Amount = {
  id: number,
  projected: number,
  solved: number,
  observation_id: number,
  inception_time: string,
  comments: string,
};

interface ObservationsSlice {
  observations: Array<Observation> | null;
  observation: Observation | null;
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

type CatalogItem = {
  id: number,
  title: string,
};

type Audit = {
  id: number,
  title: string,
  dependency_id: number,
  year: number,
};

type Fiscal = {
  id: number,
  title: string,
  description: string,
};

type ObservationCode = {
  id: number,
  title: string,
};

type Division = CatalogItem;

export type Catalog = {
  observation_types: Array<CatalogItem> | null,
  social_programs: Array<CatalogItem> | null,
  audits: Array<Audit> | null,
  fiscals: Array<Fiscal> | null,
  observation_codes: Array<ObservationCode> | null,
  divisions: Array<Division> | null,
};

const initialState: ObservationsSlice = {
  observations: null,
  observation: null,
  catalog: null,
  loading: false,
  paging: {
    count: 0,
    pages: 0,
    page: 1,
    per_page: 5,
    order: 'desc',
    order_by: 'id',
  },
};

export const sliceName = 'observationsSlice';
export const observationsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
