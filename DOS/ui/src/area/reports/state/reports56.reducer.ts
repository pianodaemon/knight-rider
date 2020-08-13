import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Reporte  Interface
export interface Reporte56 {
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

interface Reporte56Slice {
  report: Reporte56 | null;
  loading: boolean;
}

const initialState: Reporte56Slice = {
  report: null,
  loading: false,
};

export const sliceName = 'report56Slice';
export const result56Reducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
