import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Observation ASF Interface
export interface ObservationASF {
  id: number;
  direccion_id: number;
  fecha_captura: string;
  programa_social_id: number;
  auditoria_id: number;
  num_oficio_of: string;
  fecha_recibido: string;
  fecha_vencimiento_of: string;
  num_observacion: string;
  observacion: string;
  monto_observado: number;
  num_oficio_cytg: string;
  fecha_oficio_cytg: string;
  fecha_recibido_dependencia: string;
  fecha_vencimiento: string;
  num_oficio_resp_dependencia: string;
  fecha_oficio_resp_dependencia: string;
  resp_dependencia: string;
  comentarios: string;
  clasif_final_cytg: string;
  num_oficio_org_fiscalizador: string;
  fecha_oficio_org_fiscalizador: string;
  estatus_criterio_int_id: string;
  proyecciones: Array<number> | null;
}

interface ObservationsASFSlice {
  observations: Array<ObservationASF> | null;
  observation: ObservationASF | null;
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

type Division = CatalogItem;
type Dependency = CatalogItem & { clasif_title: string, description: string };
type SocialProgram = CatalogItem & {
  central: boolean,
  paraestatal: boolean,
  obra_pub: boolean,
};
type EstatusPreASF = CatalogItem;
type ProyeccionesASF = CatalogItem;
type ClasifInternas = {
  direccion_id: number,
  clasifs_internas_pairs: Array<{ sorting_val: number, title: string }>,
};

export type Catalog = {
  audits: Array<Audit> | null,
  dependencies: Array<Dependency> | null,
  divisions: Array<Division> | null,
  estatus_pre_asf: Array<EstatusPreASF> | null,
  social_programs: Array<SocialProgram> | null,
  proyecciones_asf: Array<ProyeccionesASF> | null,
  clasifs_internas_cytg: Array<ClasifInternas>,
};

const initialState: ObservationsASFSlice = {
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

export const sliceName = 'observationsASFSlice';
export const observationsASFReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
