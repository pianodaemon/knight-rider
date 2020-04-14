import { createSelector } from 'reselect';
import { auditsReducer, Audit } from './audits.reducer';

const sliceSelector = (state: any) => state[auditsReducer.sliceName];

export const auditsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.audits
);

export const auditSelector = createSelector(
  sliceSelector,
  (slice: any): Audit | null => slice.audit
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.catalog
);

export const auditsCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    slice.audits &&
    Array.isArray(slice.audits) &&
    slice.audits.map((audit: Audit) => {
      let dependency_id_title = catalog.dependencies.find(
        (item: any) => item.id === audit.dependency_id
      );
      dependency_id_title = dependency_id_title
        ? dependency_id_title.title
        : null;
      return {
        ...audit,
        dependency_id_title,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging,
);
