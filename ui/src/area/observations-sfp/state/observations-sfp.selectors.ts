import { createSelector } from 'reselect';
import {
  observationsSFPReducer,
  ObservationSFP,
} from './observations-sfp.reducer';

const sliceSelector = (state: any) => state[observationsSFPReducer.sliceName];

export const observationsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observations,
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

export const observationSFPSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any): ObservationSFP | null => {
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
    slice.observations.map((observation: ObservationSFP) => {
      const anio_auditoria =
        catalog &&
        catalog.audits &&
        observation.auditoria_id &&
        catalog.audits.find((item: any) => item.id === observation.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === observation.auditoria_id,
              ) || {}
            ).years
          : '';
      let direccion_id_title: any = catalog.divisions.find(
        (item: any) => item.id === observation.direccion_id
      );
      let auditoria_id_title: any = catalog.audits.find(
        (item: any) => item.id === observation.auditoria_id
      );
      let programa_social_id_title: any = catalog.social_programs.find(
        (item: any) => item.id === observation.programa_social_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.title : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.title : null;
      programa_social_id_title = programa_social_id_title
        ? programa_social_id_title.title
        : null;
      const dependencies =
        catalog &&
        catalog.audits &&
        observation.auditoria_id &&
        catalog.audits.find((item: any) => item.id === observation.auditoria_id)
          ? (
              catalog.audits.find(
                (item: any) => item.id === observation.auditoria_id,
              ) || {}
            ).dependency_ids
              .map((dependency: number) =>
                catalog.dependencies.find((item: any) => item.id === dependency)
              )
              .map((item: any) => item.title)
              .join(', ')
          : '';
      return {
        ...observation,
        direccion_id_title,
        auditoria_id_title,
        dependencies,
        programa_social_id_title,
        anio_auditoria: anio_auditoria.join(', '),
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
