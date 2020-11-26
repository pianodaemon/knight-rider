import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Results Report Interface
export interface ResultsReportASENL {
  id: number; // Id de la observacion de la ASENL (Informe de Resultados) [DONE]
  observacion_pre_id: number; // Id de la obs preliminar asociada a este Informe de Resultados [DONE]
  num_oficio_of: string; // Num. de Oficio del OF al Congreso (Resultados) [DONE]
  fecha_publicacion: string; // Fecha de publicación [DONE]
  tipo_observacion_id: number; // Id del tipo de observación [DONE]
  num_observacion: string; // Num. de observación [DONE]
  observacion_final: string; // Texto de la observación final (análisis) [DONE]
  observacion_reincidente: boolean; // Observación reincidente (Sí/No) [DONE]
  anios_reincidencia: string; // Años reincidencia [DONE]
  monto_observado: number; // Monto observado [DONE]
  compartida_observacion: string; // Observación (compartida) [DONE]
  compartida_tipo_observacion_id: number; // Tipo de observación (compartida) [DONE]
  compartida_monto: number; // Monto (compartida) [DONE]
  comentarios: string; // Comentarios [DONE]
  clasif_final_cytg: number; // Clasificación final CyTG [DONE]
  monto_solventado: number; // Monto solventado [DONE]
  monto_pendiente_solventar: number; // Monto pendiente de solventar [DONE]
  monto_a_reintegrar: number; // Monto a reintegrar [DONE]
  acciones: Array<number>; // Acciones [DONE]
  recomendaciones: string; // Recomendaciones [DONE]
  num_oficio_recomendacion: string; // Num. de Oficio de recomendación [DONE]
  fecha_oficio_recomendacion: string; // Fecha del Oficio de recomendación [DONE]
  fecha_vencimiento_enviar_asenl: string; // Fecha de vencimiento para enviar a ASENL [DONE]
  num_oficio_dependencia: string; // Num. de Oficio para dependencia [DONE]
  fecha_oficio_dependencia: string; // Fecha de Oficio para dependencia [DONE]
  fecha_vencimiento_interna_cytg: string; // Fecha de vencimiento interna CyTG [DONE]
  num_oficio_resp_dependencia: string; // Num. de Oficio de respuesta de dependencia [DONE]
  fecha_acuse_resp_dependencia: string; // Fecha de acuse de respuesta de dependencia [DONE]
  resp_dependencia: string; // Respuesta de dependencia (acciones a realizar) [DONE]
  num_oficio_enviar_resp_asenl: string; // Num. de Oficio para enviar respuesta a la ASENL [DONE]
  fecha_oficio_enviar_resp_asenl: string; // Fecha del Oficio para enviar respuesta a la ASENL [DONE]
  unidad_investigadora: string; // Unidad investigadora [DONE]
  num_vai: string; // Num. VAI [DONE]
  direccion_id: number; // Id de la dirección (según obs preliminar) [DONE]
  auditoria_id: number; // Id de la auditoría (según obs preliminar) [DONE]
  tipificacion_id: number;
}

interface ResultsReportASENLSlice {
  reports: Array<ResultsReportASENL> | null;
  report: ResultsReportASENL | null;
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
  filters: Array<any>;
}

type CatalogItem = {
  id: number,
  title: string,
};
type AccionesASENL = CatalogItem;
type Audit = CatalogItem & {
  dependency_ids: Array<number>,
  years: Array<number>,
};
type Dependency = CatalogItem & { clasif_title: string, description: string };
type Division = CatalogItem;
type ObservationTypes = CatalogItem;
type ClasifInternas = {
  direccion_id: number,
  clasifs_internas_pairs: Array<{ sorting_val: number, title: string }>,
};

export type Catalog = {
  acciones_asenl: Array<AccionesASENL> | null,
  audits: Array<Audit> | null,
  clasifs_internas_cytg: Array<ClasifInternas> | null,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  observation_types: Array<ObservationTypes> | null,
};

const initialState: ResultsReportASENLSlice = {
  reports: null,
  report: null,
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
  filters: [],
};

export const sliceName = 'resultsReportASENLSlice';
export const resultsReportASENLReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
