import { createSelector } from 'reselect';
import {
  resultsReportCYTGReducer,
  ResultsReportCYTG,
} from './results-report-cytg.reducer';

const sliceSelector = (state: any) => state[resultsReportCYTGReducer.sliceName];

export const reportsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.reports
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => {
  const audits =
    slice && slice.catalog && slice.catalog.audits
      ? slice.catalog.audits.sort((a: any, b: any) => b.id - a.id)
      : [];
  return {
    ...slice.catalog,
    audits,
  };
});

export const reportSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any): ResultsReportCYTG | null => {
    const { report } = slice;
    if (!report) {
      return null;
    }
    return report;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const reportsCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    catalog.divisions &&
    slice.reports &&
    Array.isArray(slice.reports) &&
    slice.reports.map((report: ResultsReportCYTG) => {
      const dependencies =
        catalog &&
        catalog.audits &&
        report.auditoria_id &&
        catalog.audits.find((item: any) => item.id === report.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === report.auditoria_id
              ) || {}
            ).dependency_ids
              .map((dependency: number) =>
                catalog.dependencies.find((item: any) => item.id === dependency)
              )
              .map((item: any) => item.title)
              .join(', ')
          : '';
      let direccion_id_title: any = catalog.divisions.find(
        (item: any) => item.id === report.direccion_id
      );
      let auditoria_id_title: any = catalog.audits.find(
        (item: any) => item.id === report.auditoria_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.title : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.title : null;
      return {
        ...report,
        direccion_id_title,
        auditoria_id_title,
        dependencies,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);

export const observationPreAuditIdSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.auditoria_id
);

export const pagingPreObsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.paging
);

export const preObservationsSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) => {
    const { observations } = slice.observacion_pre;
    return observations && catalog.audits && catalog.audits.length
      ? observations.map((item: any) => {
          const audit = catalog.audits.find(
            (audit_item: any) => audit_item.id === item.auditoria_id
          );
          return {
            id: item.id,
            observation: `Observación ID: ${item.id} - Auditoría ${item.auditoria_id} : ${audit.title}`,
            direccion_id: item.direccion_id,
            programa_social_id: item.programa_social_id,
            auditoria_id: item.auditoria_id,
          };
        })
      : [];
  }
);

export const isLoadingPreSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.loading
);

export const canLoadMoreSelector = createSelector(
  sliceSelector,
  (slice: any) => {
    const { page, per_page, pages, count } = slice.observacion_pre.paging;
    return !(count && page === pages && per_page * pages >= count);
  }
);

export const auditIdSelector = createSelector(sliceSelector, (slice: any) => {
  const { auditoria_id } = slice.observacion_pre;
  return auditoria_id;
});
