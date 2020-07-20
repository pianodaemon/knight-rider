import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation ASENL Interface
export interface ObservationASENL {
  id: number; // Id de la observación de la ASENL [DONE]
  direccion_id: number; // Id de la Dirección [DONE]
  compartida_observacion: string; // Observación (compartida) [DONE]
  compartida_tipo_observacion_id: number; // Tipo de Observación (compartida) [DONE]
  compartida_monto: number; // Monto observado (compartida) [DONE]
  fecha_captura: string; // Fecha de captura [DONE]
  tipo_auditoria_id: number; // Id del Tipo de Auditoría [DONE]
  auditoria_id: number; // Id de la Auditoría [DONE]
  num_oficio_notif_obs_prelim: string; // Num. de Oficio donde notifican Observación Preliminar [DONE]
  fecha_recibido: string; // Fecha recibido (Acuse) [DONE]
  fecha_vencimiento_of: string; // Fecha de vencimiento (OF) [DONE]
  tipo_observacion_id: number; // Tipo de Observación (PROYECCION)
  num_observacion: string; // Num. de Observación [DONE]
  observacion: string; // Observación [DONE]
  monto_observado: number; // Monto observado (PROYECCION) [DONE]
  num_oficio_cytg_oic: string; // Num. de Oficio CyTG u OIC [DONE]
  fecha_oficio_cytg_oic: string; // Fecha de Oficio CyTG [DONE]
  fecha_recibido_dependencia: string; // Fecha de recibido de la dependencia (Acuse) [DONE]
  fecha_vencimiento_cytg: string; // Fecha de vencimiento [DONE]
  num_oficio_resp_dependencia: string; // Num. de Oficio de respuesta de la dependencia [DONE]
  fecha_oficio_resp: string; // Fecha de Oficio de respuesta [DONE]
  resp_dependencia: string; // Respuesta de la dependencia [DONE]
  comentarios: string; // Comentarios [DONE]
  clasif_final_cytg: number; // Clasificación final CyTG (PROYECCION) [DONE]
  num_oficio_org_fiscalizador: string; // Num. de Oficio para Órgano Fiscalizador [DONE]
  fecha_oficio_org_fiscalizador: string; // Fecha de Oficio para Órgano Fiscalizador [DONE]
  estatus_proceso_id: number; // Estatus de proceso (PROYECCION) [DONE]
  proyeccion_solventacion_id: number; // Proyección Solventación [DONE]
  resultado_final_pub_id: number; // Resultado final publicado [DONE]
}

interface ObservationsASENLSlice {
  observations: Array<ObservationASENL> | null;
  observation: ObservationASENL | null;
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
  id: number,
  dependency_ids: Array<number>,
  years: Array<number>,
};

type AuditoriaTipos = CatalogItem;
type Division = CatalogItem;
type Dependency = CatalogItem & { description: string, clasif_title: string };
type EstatusPreASENL = CatalogItem;
type ProyeccionesASENL = CatalogItem;
type ObservationTypes = CatalogItem;
type ClasifInternas = {
  direccion_id: number,
  clasifs_internas_pairs: Array<{ sorting_val: number, title: string }>,
};

export type Catalog = {
  audits: Array<Audit> | null,
  auditoria_tipos: Array<AuditoriaTipos>,
  clasifs_internas_cytg: Array<ClasifInternas>,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  estatus_pre_asenl: Array<EstatusPreASENL> | null,
  observation_types: Array<ObservationTypes> | null,
  proyecciones_asenl: Array<ProyeccionesASENL> | null,
};

const initialState: ObservationsASENLSlice = {
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

export const sliceName = 'observationsASENLSlice';
export const observationsASENLReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
