import { createSelector } from 'reselect';
import {
  actionsReducer,
  Action,
  ActionsSlice,
} from './actions.reducer';

const sliceSelector = (state: any): ActionsSlice => state[actionsReducer.sliceName];

export const actionsSelector = createSelector(
  sliceSelector,
  (slice: ActionsSlice) => slice.actions
);

export const actionSelector = createSelector(
  sliceSelector,
  (slice: ActionsSlice): Action | null => {
    const { action } = slice;
    if (!action) {
      return null;
    }
    return action;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: ActionsSlice) => slice.loading
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => slice.catalog );

export const actionCatalogSelector = createSelector(
  sliceSelector,
  (slice: ActionsSlice) =>
    (slice.catalog &&
    slice.actions &&
    slice.actions.map((action: Action) => {
      const { catalog } = slice;
      const org_fiscal_id_title =
        catalog &&
        catalog.fiscals &&
        catalog.fiscals.find((item: any) => item.id === action.org_fiscal_id)
          ? (
              catalog.fiscals.find(
                (item: any) => item.id === action.org_fiscal_id
              ) || {}
            )?.title
          : '';
      return {
        ...action,
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
        name: '(TITL) Nombre de la acción',
      },
      {
        abbr: 'FIS',
        type: 'dropdown',
        param: 'org_fiscal_id',
        name: '(FIS) Órgano fiscalizador para la Acción',
        options: catalog && catalog.fiscals ? [...catalog.fiscals.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
    ];
  }
);
