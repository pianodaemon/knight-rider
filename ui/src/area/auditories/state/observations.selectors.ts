import { createSelector } from 'reselect';
import {
  observationsReducer,
  Observation,
  ObservationRequest,
} from './observations.reducer';
import { Audit } from './audits.reducer';

const sliceSelector = (state: any) => state[observationsReducer.sliceName];

export const observationsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observations,
);

export const observationSelector = createSelector(
  sliceSelector,
  (slice: any): ObservationRequest | null => {
    if (!slice.observation) {
      return null;
    }
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
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
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
    catalog.observation_types &&
    slice.observations &&
    Array.isArray(slice.observations) &&
    slice.observations.map((observation: Observation) => {
      let observation_type_id_title = catalog.observation_types.find(
        (item: any) => item.id === observation.observation_type_id
      );
      let social_program_id_title = catalog.social_programs.find(
        (item: any) => item.id === observation.social_program_id
      );
      let audit_id_title = catalog.audits.find(
        (item: any) => item.id === observation.audit_id
      );
      observation_type_id_title = observation_type_id_title
        ? observation_type_id_title.title
        : null;
      social_program_id_title = social_program_id_title
        ? social_program_id_title.title
        : null;
      audit_id_title = audit_id_title ? audit_id_title.title : null;
      return {
        ...observation,
        observation_type_id_title,
        social_program_id_title,
        audit_id_title,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
