import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation SFP Interface
export interface ObservationSFP {
  id: number;
  direccion_id: number;
  // dependencia_id: number;
  fecha_captura: string;
  programa_social_id: number;
  auditoria_id: number;
  acta_cierre: string;
  fecha_firma_acta_cierre: string;
  fecha_compromiso: string;
  clave_observacion: string;
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
  seguimientos: Array<Seguimiento> | null;
  // anios_cuenta_publica: Array<number> | null;
}

type Seguimiento = {
  observacion_id: number,
  seguimiento_id: number,
  num_oficio_cytg_oic: string,
  fecha_oficio_cytg_oic: string,
  fecha_recibido_dependencia: string,
  fecha_vencimiento_cytg: string,
  num_oficio_resp_dependencia: string,
  fecha_recibido_oficio_resp: string,
  resp_dependencia: string,
  comentarios: string,
  clasif_final_interna_cytg: number,
  num_oficio_org_fiscalizador: string,
  fecha_oficio_org_fiscalizador: string,
  estatus_id: number,
  monto_solventado: number,
  monto_pendiente_solventar: number,
};

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

type Audit = {
  id: number,
  title: string,
  dependency_ids: Array<number>,
  years: Array<number>,
};

type CatalogItem = {
  id: number,
  title: string,
};

type Division = CatalogItem;
type Dependency = CatalogItem;
type SocialProgram = CatalogItem;
type AutoridadesInvest = CatalogItem;
type ObservationCodes = CatalogItem;
type ObservationTypes = CatalogItem;
type Estatus = CatalogItem;

export type Catalog = {
  audits: Array<Audit> | null,
  autoridades_invest: Array<AutoridadesInvest> | null,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  estatus_sfp: Array<Estatus> | null,
  observation_codes: Array<ObservationCodes> | null,
  observation_types: Array<ObservationTypes> | null,
  social_programs: Array<SocialProgram> | null,
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
