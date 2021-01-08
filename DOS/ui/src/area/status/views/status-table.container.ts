import { connect } from 'react-redux';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import { StatusTable } from './status-table.component';
import { loadStatusesAction } from '../state/usecases/load-statuses.usecase';
import { removeStatusAction } from '../state/usecases/remove-status.usecase';

import {
  isLoadingSelector,
  statusCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/status.selectors';

const mapDispatchToProps = {
  loadStatusesAction,
  removeStatusAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    statuses: statusCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const StatusTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusTable);
