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
      const dependencies = audit.dependency_ids
        .map((dependency: any) =>
          catalog.dependencies.find((item: any) => item.id === dependency)
        )
        .map((item: any) => (item ? item.title : ''));
      return {
        ...audit,
        dependencies: dependencies.join(', '),
        years: audit.years.join(', '),
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
