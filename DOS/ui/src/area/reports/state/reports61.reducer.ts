import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Reporte  Interface
export interface Reporte61 {
  data_rows: Array<DataRow>;
  ignored_audit_ids: Array<number>;
}

type DataRow = {
  dep: string; //Secretaría / Entidad / Municipio
  tipo: string;         // Cantidad Observaciones
  n_obs: number;           // Cant. Obs. (Solventadas)
  obs: number;           // Monto (Solventadas)
  estatus: number;        // Cant. Obs. (No Solventadas)
  c_obs: number;        // Monto (No Solventadas)
  monto: number;       // Cant. Obs. (En Analisis)
};

interface Reporte61Slice {
  report: Reporte61 | null;
  loading: boolean;
}

const initialState: Reporte61Slice = {
  report: null,
  loading: false,
};

export const sliceName = 'report61Slice';
export const result61Reducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
