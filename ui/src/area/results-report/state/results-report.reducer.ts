import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Results Report Interface
export interface ResultsReport {
  id: number;
  observacion_pre_id: number;
  num_oficio_of: string;
  fecha_recibido: string;
  fecha_vencimiento: string;
  observacion_ir: string;
  tipo_observacion_id: number;
  accion: string;
  clave_accion: string;
  monto_observado: number;
  monto_a_reintegrar: number;
  monto_reintegrado: number;
  fecha_reintegro: string;
  monto_por_reintegrar: number;
  tiene_pras: boolean;
  seguimientos: Array<Seguimiento>;
  pras: PRA;
  direccion_id: number;
  auditoria_id: number;
  programa_social_id: number;
}

type Seguimiento = {
  observacion_id: number,
  seguimiento_id: number,
  medio_notif_seguimiento_id: number,
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
  num_oficio_monto_solventado: string,
  fecha_oficio_monto_solventado: string,
  monto_pendiente_solventar: number,
};

type PRA = {
  pras_observacion_id: number,
  num_oficio_of_vista_cytg: string,
  fecha_oficio_of_vista_cytg: string,
  num_oficio_cytg_aut_invest: string,
  fecha_oficio_cytg_aut_invest: string,
  num_carpeta_investigacion: string,
  num_oficio_cytg_org_fiscalizador: string,
  fecha_oficio_cytg_org_fiscalizador: string,
  num_oficio_vai_municipio: string,
  fecha_oficio_vai_municipio: string,
  autoridad_invest_id: number,
  num_oficio_pras_of: string,
  fecha_oficio_pras_of: string,
  num_oficio_pras_cytg_dependencia: string,
  num_oficio_resp_dependencia: string,
  fecha_oficio_resp_dependencia: string,
};

interface ResultsReportSlice {
  reports: Array<ResultsReport> | null;
  report: ResultsReport | null;
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

type Audit = CatalogItem & {
  dependency_ids: Array<number>,
  years: Array<number>,
};

type AutoridadesInvest = CatalogItem;
type Dependency = CatalogItem;
type Division = CatalogItem;
type EstatusIresASF = CatalogItem;
type MediosNotifSeguimientoASF = CatalogItem;
type ObservationTypes = CatalogItem;
type ObservationCodes = CatalogItem;
type SocialProgram = CatalogItem;

export type Catalog = {
  audits: Array<Audit>,
  autoridades_invest: Array<AutoridadesInvest>,
  dependencies: Array<Dependency>,
  divisions: Array<Division>,
  estatus_ires_asf: Array<EstatusIresASF>,
  medios_notif_seguimiento_asf: Array<MediosNotifSeguimientoASF>,
  observation_codes: Array<ObservationCodes>,
  observation_types: Array<ObservationTypes>,
  social_programs: Array<SocialProgram>,
};

const initialState: ResultsReportSlice = {
  reports: null,
  report: null,
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

export const sliceName = 'resultsReportSlice';
export const resultsReportReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
