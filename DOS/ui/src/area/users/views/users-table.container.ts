import { connect } from 'react-redux';
import { UsersTable } from './users-table.component';
import { loadUsersAction } from '../state/usecases/load-users.usecase';
import { removeUserAction } from '../state/usecases/remove-user.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  usersCatalogSelector,
  pagingSelector,
} from '../state/users.selectors';

const mapDispatchToProps = {
  loadUsersAction,
  removeUserAction,
};

function mapStateToProps(state: any) {
  return {
    users: usersCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const UsersTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTable);
