import { createSelector } from 'reselect';
import {
  observationsSFPReducer,
  ObservationSFP,
} from './observations-sfp.reducer';
import { FISCALS } from "src/shared/constants/observations.constants";

const sliceSelector = (state: any) => state[observationsSFPReducer.sliceName];

export const observationsSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.observations
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => {
  const audits =
    slice && slice.catalog && slice.catalog.audits
      ? slice.catalog.audits.sort((a: any, b: any) => b.id - a.id).filter((audit: any) => audit.org_fiscal_id === FISCALS.SFP)
      : [];
  const social_programs =
    slice && slice.catalog && slice.catalog.social_programs
      ? [
          ...slice.catalog.social_programs.map((program: any) => {
            return {
              ...program,
              title: `${program.title} - ${program.description}`,
            };
          }),
        ]
      : [];
  return {
    ...slice.catalog,
    audits,
    social_programs,
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
  (slice: any) => {
    const { catalog } = slice;
    return (
      catalog &&
      catalog.divisions &&
      slice.observations &&
      Array.isArray(slice.observations) &&
      slice.observations.map((observation: ObservationSFP) => {
        const anio_auditoria =
          catalog &&
          catalog.audits &&
          observation.auditoria_id &&
          catalog.audits.find(
            (item: any) => item.id === observation.auditoria_id,
          )
            ? (
                catalog.audits.find(
                  (item: any) => item.id === observation.auditoria_id,
                ) || {}
              ).years
            : '';
        let direccion_id_title: any = catalog.divisions.find(
          (item: any) => item.id === observation.direccion_id,
        );
        let auditoria_id_title: any = catalog.audits.find(
          (item: any) => item.id === observation.auditoria_id,
        );
        let programa_social_id_title: any = catalog.social_programs.find(
          (item: any) => item.id === observation.programa_social_id,
        );
        direccion_id_title = direccion_id_title
          ? direccion_id_title.title
          : null;
        auditoria_id_title = auditoria_id_title
          ? auditoria_id_title.title
          : null;
        programa_social_id_title = programa_social_id_title
          ? programa_social_id_title.title
          : null;
        const dependencies =
          catalog &&
          catalog.audits &&
          observation.auditoria_id &&
          catalog.audits.find(
            (item: any) => item.id === observation.auditoria_id,
          )
            ? (
                catalog.audits.find(
                  (item: any) => item.id === observation.auditoria_id,
                ) || {}
              ).dependency_ids
                .map((dependency: number) =>
                  catalog.dependencies.find(
                    (item: any) => item.id === dependency,
                  )
                )
                .map((item: any) => item && item.title)
                .join(', ').replace(/,+.$|^,/, '') // @todo remove workaround for trailing commas
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
  }
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
  (slice: any) => {
    const { catalog } = slice;
    return [
      {
        abbr: 'DIR',
        type: 'dropdown',
        param: 'direccion_id',
        name: '(DIR) Dirección',
        options: catalog && catalog.divisions ? [...catalog.divisions.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'AUD',
        type: 'dropdown',
        param: 'auditoria_id',
        name: '(AUD) Auditoría',
        options: catalog && catalog.audits ? [...catalog.audits.filter((audit: any) => audit.org_fiscal_id === FISCALS.SFP).map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'PRO',
        type: 'dropdown',
        param: 'programa_social_id',
        name: '(PRO) Programa Social',
        options: catalog && catalog.social_programs ? [...catalog.social_programs.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'TOB',
        type: 'dropdown',
        param: 'tipo_observacion_id',
        name: '(TOB) Tipo de Observación',
        options: catalog && catalog.observation_types ? [...catalog.observation_types.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'CLO',
        type: 'text',
        param: 'clave_observacion',
        name: '(CLO) Clave o Num. de observacion',
      },
      {
        abbr: 'O',
        type: 'text',
        param: 'observacion',
        name: '(O) Observación',
      },
    ];
  }
);