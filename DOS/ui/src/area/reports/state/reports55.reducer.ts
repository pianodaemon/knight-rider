import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Reporte  Interface
export interface Reporte55 {
  data_rows: Array<DataRow>;
  ignored_audit_ids: Array<number>;
}

type DataRow = {
    dep :       string;     //Secretaría / Entidad / Municipio
    c_asf :     number;     // Cantidad Observaciones
    m_asf :     number;     // Cant. Obs. (Solventadas)
    c_na_asf :  number;     // Monto (Solventadas)
    m_na_asf :  number;     // Cant. Obs. (No Solventadas)
    c_a_asf :   number;     // Monto (No Solventadas)
    m_a_asf :   number;     // Cant. Obs. (En Analisis)
    c_asenl :   number;     // Monto (En Analisis)
    m_asenl :   number;
    c_na_asenl :number;
    m_na_asenl :number;
    c_a_asenl : number;
    m_a_asenl : number;
    c_cytg :    number;
    m_cytg :    number;
    c_na_cytg : number;
    m_na_cytg : number;
    c_a_cytg :  number;
    m_a_cytg :  number;
    c_na_total :number;
    m_na_total :number;
    c_a_total : number;
    m_a_total : number;
};

interface Reporte55Slice {
  report: Reporte55 | null;
  loading: boolean;
}

const initialState: Reporte55Slice = {
  report: null,
  loading: false,
};

export const sliceName = 'report55Slice';
export const result55Reducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
