import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Results Report CYTG Interface
export interface ResultsReportCYTG {
  id: number; // Id de la observacion de la CyTG (resultados) [DONE]
  observacion_pre_id: number; // Id de la observación preliminar vinculada a la presente observación de resultados [DONE]
  num_observacion: string; // Num. de observación [DONE]
  observacion: string; // Observación [DONE]
  tipo_observacion_id: number; // Id del tipo de observacion [DONE]
  estatus_info_resultados_id: number; // Estatus informe de resultados [DONE]
  acciones_preventivas: string; // Acciones preventivas [DONE]
  acciones_correctivas: string; // Acciones correctivas [DONE]
  clasif_final_cytg: number; // Clasificación final CyTG [DONE]
  monto_solventado: number; // Monto solventado [DONE]
  monto_pendiente_solventar: number; // Monto pendiente de solventar [DONE]
  monto_a_reintegrar: number; // Monto a reintegrar [DONE]
  monto_reintegrado: number; // Monto reintegrado [DONE]
  fecha_reintegro: string; // Fecha del reintegro [DONE]
  monto_por_reintegrar: number; // Monto por reintegrar [DONE]
  num_oficio_cytg_aut_invest: string; // Num. de Oficio de la CyTG para la Autoridad investigadora [DONE]
  fecha_oficio_cytg_aut_invest: string; // Fecha de Oficio de la CyTG para la Autoridad investigadora [DONE]
  num_carpeta_investigacion: string; // Num. de carpeta de investigación [DONE]
  num_oficio_vai_municipio: string; // Num. de Oficio VAI a municipio [DONE]
  fecha_oficio_vai_municipio: string; // Fecha de Oficio VAI a municipio [DONE]
  num_oficio_pras_cytg_dependencia: string; // Num. de Oficio PRAS/PFRA de la CyTG para la Dependencia [DONE]
  num_oficio_resp_dependencia: string; // Num. de Oficio de respuesta de la Dependencia [DONE]
  fecha_oficio_resp_dependencia: string; // Fecha de Oficio de respuesta de la Dependencia => Fecha de oficio (acuse) [DONE]
  seguimientos: Array<Seguimiento>; // Seguimientos
  direccion_id: number; // Id de la dirección (según obs preliminar) [DONE]
  auditoria_id: number; // Id de la auditoría (según obs preliminar) [DONE]
  programa_social_id: number; // Id del programa social (según obs preliminar) [DONE]
}

type Seguimiento = {
  observacion_id: number, // Id de la observación de informe de resultados a la que pertenece el seguimiento []
  seguimiento_id: number, // Id del seguimiento [DONE]
  num_oficio_ires: string, // Num. de Oficio del informe de resultados/cédula de seguimiento [DONE]
  fecha_notif_ires: string, // Fecha de notificación (acuse) [DONE]
  fecha_vencimiento_ires: string, // Fecha de vencimiento (resultados/cédula) [DONE]
  prorroga: boolean, // Prórroga (Sí o No) [DONE]
  num_oficio_solic_prorroga: string, // Num. de Oficio de Solicitud de prórroga [DONE]
  fecha_oficio_solic_prorroga: string, // Fecha de Oficio de Solicitud de prórroga (acuse) [DONE]
  num_oficio_contest_prorroga: string, // Num. de Oficio de Contestación de prórroga [DONE]
  fecha_oficio_contest: string, // Fecha de Oficio de Contestación de prórroga [DONE]
  fecha_vencimiento_ires_nueva: string, // Fecha de nuevo vencimiento (informe de resultados) [DONE]
  num_oficio_resp_dependencia: string, // Num. de Oficio de respuesta de la Dependencia [DONE]
  fecha_oficio_resp_dependencia: string, // Fecha de Oficio de respuesta de la Dependencia [DONE]
  resp_dependencia: string, // Respuesta de la Dependencia [DONE]
  comentarios: string, // Comentarios [DONE]
  estatus_seguimiento_id: number, // Id del estatus del seguimiento []
  monto_solventado: number, // Monto solventado [DONE]
  monto_pendiente_solventar: number, // Monto pendiente de solventar [DONE]
};

interface ResultsReportCYTGSlice {
  reports: Array<ResultsReportCYTG> | null;
  report: ResultsReportCYTG | null;
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
  observacion_pre: {
    paging: {
      count: number,
      pages: number,
      page: number,
      per_page: number,
      order: string,
      order_by: string,
    },
    auditoria_id: number, // @todo this is a query param, it should be wrapped on a criteria object when more params were added
    loading: boolean,
    observations: Array<any> | null,
    error: any,
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
type ClasifInternas = {
  direccion_id: number,
  clasifs_internas_pairs: Array<{ sorting_val: number, title: string }>,
};
type Dependency = CatalogItem & { clasif_title: string, description: string };
type Division = CatalogItem;
type ObservationTypes = CatalogItem;
type SocialProgram = CatalogItem & {
  central: boolean,
  description: string,
  obra_pub: boolean,
  paraestatal: boolean,
};

export type Catalog = {
  audits: Array<Audit> | null,
  clasifs_internas_cytg: Array<ClasifInternas> | null,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  estatus_ires_cytg: Array<CatalogItem>,
  observation_types: Array<ObservationTypes> | null,
  social_programs: Array<SocialProgram>,
};

const initialState: ResultsReportCYTGSlice = {
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
  observacion_pre: {
    paging: {
      count: 0,
      pages: 0,
      page: 1,
      per_page: 5,
      order: 'asc',
      order_by: 'id',
    },
    auditoria_id: 0, // Query param
    error: null,
    loading: false,
    observations: [],
  },
};

export const sliceName = 'resultsReportCYTGSlice';
export const resultsReportCYTGReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
