import { connect } from 'react-redux';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import { ActionTable } from './actions-table.component';
import { loadActionsAction } from '../state/usecases/load-actions.usecase';
import { removeActionAction } from '../state/usecases/remove-action.usecase';

import {
  isLoadingSelector,
  actionCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/actions.selectors';

const mapDispatchToProps = {
  loadActionsAction,
  removeActionAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    actions: actionCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ActionTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionTable);
