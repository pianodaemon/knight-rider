import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation CYTG Interface
export interface ObservationCYTG {
  id: number; // Id de la observación de la CyTG [DONE]
  periodo_revision_de: string; // Periodo de revision (de) [DONE]
  periodo_revision_a: string; // Periodo de revision (a) [DONE]
  direccion_id: number; // Id de la Dirección [DONE]
  fecha_captura: string; // Fecha captura [DONE]
  programa_social_id: number; // Programa/Rubro [DONE]
  auditoria_id: number; // Id de la Auditoría [DONE]
  tipo_auditoria_id: number; // Tipo de Auditoría [DONE]
  num_oficio_inicio: string; // Num. de Oficio de Inicio [DONE]
  fecha_notificacion_inicio: string; // Fecha de notificación (acuse) [DONE]
  fecha_vencimiento_nombra_enlace: string; // Fecha de vencimiento (Nombramiento de enlace) [DONE]
  num_oficio_requerimiento: string; // Num. de Oficio de requerimiento [DONE]
  fecha_notificacion_requerimiento: string; // Fecha de notificación de requerimiento (acuse) [DONE]
  fecha_vencimiento_requerimiento: string; // Fecha de vencimiento (requerimiento) [DONE]
  fecha_vencimiento_nueva: string; // Fecha de nuevo vencimiento [DONE]
  tipo_observacion_id: number; // Tipo de observación preliminar [DONE]
  num_observacion: string; // Num. de observación [DONE]
  observacion: string; // Observación [DONE] - LONG
  monto_observado: number; // Monto observado [DONE]
  num_oficio_cytg_oic_pre: string; // Num. de Oficio CyTG u OIC de informe preliminar [DONE]
  fecha_oficio_cytg_pre: string; // Fecha de Oficio CyTG informe preliminar [DONE]
  fecha_recibido_dependencia: string; // Fecha de recibido de la dependencia (acuse) [DONE]
  fecha_vencimiento_pre: string; // Fecha de vencimiento (preliminares) [DONE]
  prorroga: boolean; // Prórroga (Sí o No) [DONE]
  num_oficio_solic_prorroga: string; // Num. de Oficio de Solicitud de prórroga [DONE]
  fecha_oficio_solic_prorroga: string; // Fecha de Oficio de Solicitud de prórroga [DONE]
  num_oficio_contest_prorroga_cytg: string; // Num. de Oficio de Contestación de prórroga [DONE]
  fecha_oficio_contest_cytg: string; // Fecha de Contestación CyTG [DONE]
  fecha_vencimiento_pre_nueva: string; // Fecha de nuevo vencimiento (informe preliminar) [DONE]
  clasif_pre_cytg: number; // Clasificación (preliminar) CyTG [DONE]
  num_oficio_resp_dependencia: string; // Num. de Oficio de respuesta de la dependencia [DONE]
  fecha_oficio_resp: string; // Fecha de Oficio de respuesta (acuse) [DONE]
  resp_dependencia: string; // Respuesta de la dependencia [DONE] - LONG
  comentarios: string; // Comentarios [DONE] - LONG
  // observacion_ires_id: number; // Id de la observación de informe de resultados correspondiente []
}

interface ObservationsCYTGSlice {
  observations: Array<ObservationCYTG> | null;
  observation: ObservationCYTG | null;
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

type AuditoriaTipos = CatalogItem;
type ClasifInternas = {
  direccion_id: number,
  clasifs_internas_pairs: Array<{ sorting_val: number, title: string }>,
};
type Division = CatalogItem;
type Dependency = CatalogItem & { description: string, clasif_title: string };
type ObservationTypes = CatalogItem;
type SocialPrograms = CatalogItem & {
  description: string,
  central: boolean,
  paraestatal: boolean,
  obra_pub: boolean,
};

export type Catalog = {
  audits: Array<Audit> | null,
  auditoria_tipos_cytg: Array<AuditoriaTipos>,
  clasifs_internas_cytg: Array<ClasifInternas>,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  social_programs: Array<SocialPrograms> | null,
  observation_types: Array<ObservationTypes> | null,
};

const initialState: ObservationsCYTGSlice = {
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

export const sliceName = 'observationsCYTGSlice';
export const observationsCYTGReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
