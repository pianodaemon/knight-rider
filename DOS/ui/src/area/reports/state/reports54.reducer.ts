import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Reporte  Interface
export interface Reporte54 {
  data_rows: Array<DataRow>;
  ignored_audit_ids: Array<number>;
}

type DataRow = {
  dep: string; //Secretaría / Entidad / Municipio
  tipo_obs: string;         // Cantidad Observaciones
  c_sol: number;           // Cant. Obs. (Solventadas)
  m_sol: number;           // Monto (Solventadas)
  c_no_sol: number;        // Cant. Obs. (No Solventadas)
  m_no_sol: number;        // Monto (No Solventadas)
  c_analisis: number;       // Cant. Obs. (En Analisis)
  m_analisis: number;       // Monto (En Analisis)
};

interface Reporte54Slice {
  report: Reporte54 | null;
  loading: boolean;
}

const initialState: Reporte54Slice = {
  report: null,
  loading: false,
};

export const sliceName = 'report54Slice';
export const result54Reducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
