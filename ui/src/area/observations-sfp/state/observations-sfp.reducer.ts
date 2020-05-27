import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation SFP Interface
export interface ObservationSFP {
  id: number;
  direccion_id: number;
  dependencia_id: number;
  fecha_captura: string;
  programa_social_id: number;
  auditoria_id: number;
  acta_cierre: string;
  fecha_firma_acta_cierre: string;
  fecha_compromiso: string;
  clave_observacion_id: number;
  observacion: string;
  acciones_correctivas: string;
  acciones_preventivas: string;
  tipo_observacion_id: number;
  monto_observado: number;
  monto_a_reintegrar: number;
  monto_reintegrado: number;
  fecha_reintegro: string;
  monto_por_reintegrar: number;
  num_oficio_of_vista_cytg: string;
  fecha_oficio_of_vista_cytg: string;
  num_oficio_cytg_aut_invest: string;
  fecha_oficio_cytg_aut_invest: string;
  num_carpeta_investigacion: string;
  num_oficio_vai_municipio: string;
  fecha_oficio_vai_municipio: number;
  autoridad_invest_id: number;
  num_oficio_pras_of: number;
  fecha_oficio_pras_of: number;
  num_oficio_pras_cytg_dependencia: number;
  num_oficio_resp_dependencia: number;
  fecha_oficio_resp_dependencia: number;
}

interface ObservationsSFPSlice {
  observations: Array<ObservationSFP> | null;
  observation: ObservationSFP | null;
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

const initialState: ObservationsSFPSlice = {
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

export const sliceName = 'observationsSFPSlice';
export const observationsSFPReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
