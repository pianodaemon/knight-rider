import { createSelector } from 'reselect';
import { userReducer, User } from './users.reducer';

const sliceSelector = (state: any) => state[userReducer.sliceName];

export const usersSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.users
);

export const userSelector = createSelector(
  sliceSelector,
  (slice: any): User | null => slice.user
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.loading
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.catalog
);

export const usersCatalogSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: any, catalog: any) =>
    catalog &&
    catalog.divisions &&
    catalog.orgchart_roles &&
    slice.users &&
    Array.isArray(slice.users) &&
    slice.users.map((user: User) => {
      let division_id_title = catalog.divisions.find(
        (item: any) => item.id === user.division_id
      );
      let orgchart_role_id_title = catalog.orgchart_roles.find(
        (item: any) => item.id === user.orgchart_role_id
      );
      division_id_title = division_id_title ? division_id_title.title : null;
      orgchart_role_id_title = orgchart_role_id_title
        ? orgchart_role_id_title.title
        : null;
      return {
        ...user,
        division_id_title,
        orgchart_role_id_title,
        disabled: user.disabled ? 'No' : 'Sí',
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: any) => slice.paging
);
