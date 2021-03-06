import { createSelector } from 'reselect';
import { FISCALS } from 'src/shared/constants/observations.constants';
import { range } from 'src/shared/utils/range.util';
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
      ? slice.catalog.audits.sort((a: any, b: any) => b.id - a.id).filter((audit: any) => audit.org_fiscal_id === FISCALS.ASENL)
      : [];
  /* @todo Add when backend ready
  const observation_types =
    slice && slice.catalog && slice.catalog.observation_types
      ? [
          ...[{ id: '', title: 'Seleccione una Opción' }],
          ...slice.catalog.observation_types,
        ]
      : [];
  */
  return {
    ...slice.catalog,
    audits,
    // observation_types
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
        options: catalog && catalog.audits ? [...catalog.audits.filter((audit: any) => audit.org_fiscal_id === FISCALS.ASENL).map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'TO',
        type: 'dropdown',
        param: 'tipo_observacion_id',
        name: '(TO) Tipo de observación preliminar',
        options: catalog && catalog.observation_types ? [...catalog.observation_types.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'ACP',
        type: 'dropdown',
        param: 'anio_cuenta_pub',
        name: '(ACP) Año de la cuenta pública',
        options: range(2000, new Date().getFullYear()).map((year: number) => { return { id: year, value: year } }),
      },
      {
        abbr: 'DEP',
        type: 'dropdown',
        param: 'dependencia_id',
        name: '(DEP) Dependencia',
        options: catalog && catalog.dependencies ? [...catalog.dependencies.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'CLO',
        type: 'text',
        param: 'num_observacion',
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
