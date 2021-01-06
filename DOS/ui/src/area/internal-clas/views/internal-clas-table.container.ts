import { connect } from 'react-redux';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import { InternalClasTable } from './internal-clas-table.component';
import { loadInternalClasAction } from '../state/usecases/load-internal-clas.usecase';
import { removeInternalClasAction } from '../state/usecases/remove-internal-clas.usecase';

import {
  isLoadingSelector,
  internalClasCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/internal-clas.selectors';

const mapDispatchToProps = {
  loadInternalClasAction,
  removeInternalClasAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    internalClasses: internalClasCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const InternalClasTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalClasTable);
