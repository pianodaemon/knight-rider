import { createSelector } from 'reselect';
import {
  socialProgramsReducer,
  SocialProgram,
  SocialProgramsSlice,
} from './social-programs.reducer';

const sliceSelector = (state: any): SocialProgramsSlice => state[socialProgramsReducer.sliceName];

export const socialProgramsSelector = createSelector(
  sliceSelector,
  (slice: SocialProgramsSlice) => slice.socialPrograms
);

export const socialProgramSelector = createSelector(
  sliceSelector,
  (slice: SocialProgramsSlice): SocialProgram | null => {
    const { socialProgram } = slice;
    if (!socialProgram) {
      return null;
    }
    return socialProgram;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: SocialProgramsSlice) => slice.loading
);

export const socialProgramCatalogSelector = createSelector(
  sliceSelector,
  (slice: SocialProgramsSlice) =>
    slice.socialPrograms &&
    slice.socialPrograms.map((socialProgram: SocialProgram) => {
      return {
        ...socialProgram,
        central_str: socialProgram.central ? 'Sí' : 'No',
        paraestatal_str: socialProgram.paraestatal ? 'Sí' : 'No',
        obra_pub_str: socialProgram.obra_pub ? 'Sí' : 'No',
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);

export const filterOptionsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.filters
);

export const filterSelector = createSelector(
  sliceSelector,
  (slice: any) => {
    const options = [{ id: 'true', value: 'Sí' },{ id: 'false', value: 'No' }];
    return [
      {
        abbr: 'OP',
        type: 'dropdown',
        param: 'obra_pub',
        name: 'Vinculación con Obra Pública',
        options,
      },
      {
        abbr: 'PE',
        type: 'dropdown',
        param: 'paraestatal',
        name: 'Vinculación con Paraestatal',
        options,
      },
      {
        abbr: 'CE',
        type: 'dropdown',
        param: 'central',
        name: 'Vinculación con Central',
        options,
      },
      {
        abbr: 'DESC',
        type: 'text',
        param: 'description',
        name: 'Nombre del Programa Social',
      },
      {
        abbr: 'TITL',
        type: 'text',
        param: 'title',
        name: 'Siglas del Programa Social',
      },
    ];
  }
);
