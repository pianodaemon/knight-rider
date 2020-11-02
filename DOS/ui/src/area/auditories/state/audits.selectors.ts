import { createSelector } from 'reselect';
import {
  auditsReducer,
  Audit,
  AuditsSlice,
  Dependency,
} from './audits.reducer';

const sliceSelector = (state: any) => state[auditsReducer.sliceName];

export const auditsSelector = createSelector(
  sliceSelector,
  (slice: AuditsSlice) => slice.audits
);

export const auditSelector = createSelector(
  sliceSelector,
  (slice: AuditsSlice): Audit | null => slice.audit
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: AuditsSlice) => slice.loading
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: AuditsSlice) => {
    return slice.catalog && slice.catalog.dependencies
      ? {
          ...slice.catalog,
          dependencies: [
            ...slice.catalog.dependencies.map((dependency: Dependency) => {
              return {
                ...dependency,
                title: `${dependency.title} - ${dependency.description}`,
              };
            }),
          ].sort((a: Dependency, b: Dependency) =>
            a.title.localeCompare(b.title)
          ),
        }
      : null;
  }
);

export const auditsCatalogSelector = createSelector(
  sliceSelector,
  (slice: any) =>
    slice.audits &&
    slice.catalog &&
    Array.isArray(slice.audits) &&
    slice.audits.map((audit: Audit) => {
      const dependencies = audit.dependency_ids
        .map((dependency: any) =>
          slice.catalog.dependencies.find((item: any) => item.id === dependency)
        )
        .map((item: any) => (item ? item.title : ''));
      const fiscal = slice.catalog.fiscals.find((item: any) => item.id === audit.org_fiscal_id)?.title;
      const division = slice.catalog.divisions.find((item: any) => item.id === audit.direccion_id)?.title;
      return {
        ...audit,
        dependencies: dependencies.join(', '),
        division,
        fiscal,
        years: audit.years.join(', '),
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: AuditsSlice) => slice.paging
);
