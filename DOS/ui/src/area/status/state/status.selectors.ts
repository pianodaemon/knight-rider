import { createSelector } from 'reselect';
import {
  statusReducer,
  Status,
  StatusSlice,
} from './status.reducer';

const sliceSelector = (state: any): StatusSlice => state[statusReducer.sliceName];

export const statusesSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.statuses
);

export const statusSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice): Status | null => {
    const { status } = slice;
    if (!status) {
      return null;
    }
    return status;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.loading
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => slice.catalog );

export const statusCatalogSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) =>
    (slice.catalog &&
    slice.statuses &&
    slice.statuses.map((status: Status) => {
      const { catalog } = slice;
      const org_fiscal_id_title =
        catalog &&
        catalog.fiscals &&
        catalog.fiscals.find((item: any) => item.id === status.org_fiscal_id)
          ? (
              catalog.fiscals.find(
                (item: any) => item.id === status.org_fiscal_id
              ) || {}
            )?.title
          : '';
      return {
        ...status,
        org_fiscal_id_title,
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
        name: 'Título del estatus',
      },
      {
        abbr: 'P_IR',
        type: 'dropdown',
        param: 'pre_ires',
        name: 'Preliminar o Informe de Resultados',
        options: [{ id: 'pre', value: 'Preliminar' },{ id: 'ires', value: 'Informe de Resultados' }],
      },
      {
        abbr: 'FIS',
        type: 'dropdown',
        param: 'org_fiscal_id',
        name: '(FIS) Órgano fiscalizador',
        options: catalog && catalog.fiscals ? [...catalog.fiscals.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
    ];
  }
);
