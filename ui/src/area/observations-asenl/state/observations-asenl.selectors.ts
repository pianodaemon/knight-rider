import { createSelector } from 'reselect';
import {
  observationsASENLReducer,
  ObservationASENL,
} from './observations-asenl.reducer';

const sliceSelector = (state: any) => state[observationsASENLReducer.sliceName];

export const observationsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observations
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

export const observationASENLSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any): ObservationASENL | null => {
    const { observation } = slice;
    if (!observation) {
      return null;
    }
    return observation;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const observationsCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    catalog.divisions &&
    slice.observations &&
    Array.isArray(slice.observations) &&
    slice.observations.map((observation: ObservationASENL) => {
      const years =
        catalog &&
        catalog.audits &&
        observation.auditoria_id &&
        catalog.audits.find((item: any) => item.id === observation.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === observation.auditoria_id
              ) || {}
            ).years
          : '';
      const dependency_ids =
        catalog &&
        catalog.audits &&
        observation.auditoria_id &&
        catalog.audits.find((item: any) => item.id === observation.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === observation.auditoria_id
              ) || {}
            ).dependency_ids
          : '';
      const dependencias =
        catalog &&
        catalog.dependencies &&
        dependency_ids &&
        dependency_ids.length &&
        dependency_ids
          .map((dependency: any) =>
            catalog?.dependencies?.find((item: any) => item.id === dependency)
              ? (
                  catalog.dependencies.find(
                    (item: any) => item.id === dependency
                  ) || {}
                ).title
              : ''
          )
          .join(', ');
      let direccion_id_title: any = catalog.divisions.find(
        (item: any) => item.id === observation.direccion_id
      );
      let auditoria_id_title: any = catalog.audits.find(
        (item: any) => item.id === observation.auditoria_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.title : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.title : null;
      return {
        ...observation,
        direccion_id_title,
        auditoria_id_title,
        dependencias,
        years,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
