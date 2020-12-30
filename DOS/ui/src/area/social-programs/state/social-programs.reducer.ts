import { createAndMergeSliceReducer } from 'src/redux-utils/create-and-merge-slice-reducer';

// Base Dependency Interface
export interface SocialProgram {
  id: number;
  title: string;
  description: string;
  central: boolean;
  paraestatal: boolean;
  obra_pub: boolean;
}

export interface SocialProgramsSlice {
  socialProgram: SocialProgram | null;
  socialPrograms: Array<SocialProgram> | null;
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

const initialState: SocialProgramsSlice = {
  socialProgram: null,
  socialPrograms: null,
  loading: false,
  paging: {
    count: 0,
    pages: 0,
    page: 1,
    per_page: 200,
    order: 'desc',
    order_by: 'id',
  },
};

export const sliceName = 'socialProgramsSlice';
export const socialProgramsReducer = createAndMergeSliceReducer(
  sliceName,
  initialState,
  null
);
