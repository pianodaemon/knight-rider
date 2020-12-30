import { createSelector } from 'reselect';
import {
  dependenciesReducer,
  Dependency,
} from './dependencies.reducer';

const sliceSelector = (state: any) => state[dependenciesReducer.sliceName];

export const dependenciesSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.dependencies
);

export const catalogSelector = createSelector(sliceSelector, (slice: any) => {
  const dependencia_clasif =
    slice && slice.catalog && slice.catalog.dependencia_clasif
      ? slice.catalog.dependencia_clasif
      : [];
  return {
    dependencia_clasif,
  };
});

export const dependencySelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any): Dependency | null => {
    const { dependency } = slice;
    if (!dependency) {
      return null;
    }
    return dependency;
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const dependencyCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    catalog.dependencia_clasif &&
    slice.dependencies &&
    Array.isArray(slice.dependencies) &&
    slice.dependencies.map((dependency: Dependency) => {
      const clasif_id =
        catalog &&
        catalog.dependencia_clasif &&
        dependency.clasif_id &&
        catalog.dependencia_clasif.find((item: any) => item.id === dependency.clasif_id)
          ? (
              catalog.dependencia_clasif.find(
                (item: any) => item.id === dependency.clasif_id
              ) || {}
            )
          : null;
      let clasif_title = clasif_id ? clasif_id.title : null;
      console.log({
        ...dependency,
        clasif_title,
      });
      return {
        ...dependency,
        clasif_title,
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
        abbr: 'CLA',
        type: 'dropdown',
        param: 'clasif_id',
        name: 'Clasificación de la Dependencia',
        options: catalog && catalog.dependencia_clasif ? [...catalog.dependencia_clasif.map((item: any) => { return { id: item.id, value: item.title } })] : [],
      },
      {
        abbr: 'DESC',
        type: 'text',
        param: 'description',
        name: 'Descripción de la Dependencia',
      },
      {
        abbr: 'TITL',
        type: 'text',
        param: 'title',
        name: 'Título o siglas de la Dependencia',
      },
    ];
  }
);
