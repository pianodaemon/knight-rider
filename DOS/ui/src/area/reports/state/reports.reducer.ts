import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Reporte  Interface
export interface Reporte {
  data_rows: Array<DataRow>;
  ignored_audit_ids: Array<number>;
}

type DataRow = {
  dep: string; //Secretaría / Entidad / Municipio
  ej: number; // Ejercicio
  c_asf: number; // Cant. Obs. (ASF)
  m_asf: number; // Monto (ASF)
  c_sfp: number; // Cant. Obs. (SFP)
  m_sfp: number; // Monto (SFP)
  c_asenl: number; // Cant. Obs. (ASENL)
  m_asenl: number; // Monto (ASENL)
  c_cytg: number; // Cant. Obs. (CyTG)
  m_cytg: number; // Monto (CyTG)
};

interface ReporteSlice {
  report: Reporte | null;
  loading: boolean;
}

const initialState: ReporteSlice = {
  report: null,
  loading: false,
};

export const sliceName = 'resultsSlice';
export const resultsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
