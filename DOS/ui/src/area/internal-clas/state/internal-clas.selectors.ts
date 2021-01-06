import { createSelector } from 'reselect';
import {
  internalClasReducer,
  InternalClas,
  InternalClasSlice,
} from './internal-clas.reducer';

const sliceSelector = (state: any): InternalClasSlice => state[internalClasReducer.sliceName];

export const internalClassesSelector = createSelector(
  sliceSelector,
  (slice: InternalClasSlice) => slice.internalClasses
);

export const internalClasSelector = createSelector(
  sliceSelector,
  (slice: InternalClasSlice): InternalClas | null => {
    const { internalClas } = slice;
    if (!internalClas) {
      return null;
    }
    return internalClas;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: InternalClasSlice) => slice.loading
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => slice.catalog );

export const internalClasCatalogSelector = createSelector(
  sliceSelector,
  (slice: InternalClasSlice) =>
    (slice.catalog &&
    slice.internalClasses &&
    slice.internalClasses.map((internalClas: InternalClas) => {
      const { catalog } = slice;
      const org_fiscal_id_title =
        catalog &&
        catalog.fiscals &&
        catalog.fiscals.find((item: any) => item.id === internalClas.org_fiscal_id)
          ? (
              catalog.fiscals.find(
                (item: any) => item.id === internalClas.org_fiscal_id
              ) || {}
            )?.title
          : '';
      const direccion_id_title =
        catalog &&
        catalog.divisions &&
        catalog.divisions.find((item: any) => item.id === internalClas.direccion_id)
          ? (
              catalog.divisions.find(
                (item: any) => item.id === internalClas.direccion_id
              ) || {}
            )?.title
          : '';
      return {
        ...internalClas,
        org_fiscal_id_title,
        direccion_id_title,
      };
    })) || []
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
  catalogSelector,
  (slice: any, catalog: any) => {
    return [
      {
        abbr: 'TITL',
        type: 'text',
        param: 'title',
        name: 'Título o siglas de la Clasificación interna',
      },
      {
        abbr: 'DIR',
        type: 'dropdown',
        param: 'direccion_id',
        name: '(DIR) Dirección',
        options: catalog && catalog.divisions ? [...catalog.divisions.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'FIS',
        type: 'dropdown',
        param: 'org_fiscal_id',
        name: '(FIS) Órgano fiscalizador para la Clasificación interna',
        options: catalog && catalog.fiscals ? [...catalog.fiscals.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
    ];
  }
);
