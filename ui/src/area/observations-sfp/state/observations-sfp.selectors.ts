import { createSelector } from 'reselect';
import {
  AUDITS,
  PROGRAMS,
  DEPENDENCIES,
  DIVISIONS,
} from 'src/shared/constants/mocks/observations-sfp.constants';
import {
  observationsSFPReducer,
  ObservationSFP,
} from './observations-sfp.reducer';
import { Audit } from './audits.reducer';

const sliceSelector = (state: any) => state[observationsSFPReducer.sliceName];

export const observationsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observations,
);

export const observationSFPSelector = createSelector(
  sliceSelector,
  (slice: any): ObservationSFP | null => {
    if (!slice.observation) {
      return null;
    }
    return slice.observation;
    /*
    const item = slice.observation;
    const { amounts } = item;
    const [lastAmount] = amounts || [];
    const { projected, solved } = lastAmount || {};
    const mutatedAmounts = amounts.map((amount: any) => {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      const date = new Date().toLocaleDateString('es-MX', options);
      const newAmount = amount;
      newAmount.date = date;
      return amount;
    });
    return item
      ? {
          ...item,
          comments: '',
          projected,
          solved,
          mutatedAmounts,
        }
      : null;
      */
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading,
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => {
  const audits =
    slice && slice.catalog && slice.catalog.audits
      ? slice.catalog.audits.sort((a: Audit, b: Audit) => b.id - a.id)
      : [];
  return {
    ...slice.catalog,
    audits,
  };
});

export const observationsCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    // catalog.observation_types &&
    slice.observations &&
    Array.isArray(slice.observations) &&
    slice.observations.map((observation: ObservationSFP) => {
      let direccion_id_title: any = DIVISIONS.find(
        (item: any) => item.id === observation.direccion_id
      );
      let auditoria_id_title: any = AUDITS.find(
        (item: any) => item.id === observation.auditoria_id
      );
      let dependencia_id_title: any = DEPENDENCIES.find(
        (item: any) => item.id === parseInt(observation.dependencia_id.toString(), 10)
      );
      let programa_social_id_title: any = PROGRAMS.find(
        (item: any) =>
          item.programa_social_id === observation.programa_social_id
      );
      direccion_id_title = direccion_id_title ? direccion_id_title.desc : null;
      auditoria_id_title = auditoria_id_title ? auditoria_id_title.desc : null;
      dependencia_id_title = dependencia_id_title
        ? dependencia_id_title.title
        : null;
      programa_social_id_title = programa_social_id_title
        ? programa_social_id_title.title
        : null;
      return {
        ...observation,
        direccion_id_title,
        auditoria_id_title,
        dependencia_id_title,
        programa_social_id_title,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
