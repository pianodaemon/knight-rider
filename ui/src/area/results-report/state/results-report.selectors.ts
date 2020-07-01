import { createSelector } from 'reselect';
import { resultsReportReducer, ResultsReport } from './results-report.reducer';

const sliceSelector = (state: any) => state[resultsReportReducer.sliceName];

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
  (slice: any): ResultsReport | null => {
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
    slice.reports.map((report: ResultsReport) => {
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
      let programa_social_id_title: any = catalog.social_programs.find(
        (item: any) => item.id === report.programa_social_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.title : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.title : null;
      programa_social_id_title = programa_social_id_title
        ? programa_social_id_title.title
        : null;
      return {
        ...report,
        direccion_id_title,
        auditoria_id_title,
        programa_social_id_title,
        dependencies,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);

export const pagingPreObsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observacion_pre.paging
);

export const preObservationsSelector = createSelector(
  sliceSelector,
  (slice: any) => {
    const { observations } = slice.observacion_pre;
    return observations
      ? observations.map((item: any) => {
          return {
            id: item.id,
            observation: `Observación: ${item.id} - Auditoría ${item.auditoria_id}`,
          };
        })
      : [];
  }
);
