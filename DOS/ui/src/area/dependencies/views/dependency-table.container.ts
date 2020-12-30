import { connect } from 'react-redux';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import { DependencyTable } from './dependency-table.component';
import { loadDependenciesAction } from '../state/usecases/load-dependencies.usecase';
import { removeDependencyAction } from '../state/usecases/remove-dependency.usecase';

import {
  isLoadingSelector,
  dependencyCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/dependencies.selectors';

const mapDispatchToProps = {
  loadDependenciesAction,
  removeDependencyAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    dependencies: dependencyCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const DependencyTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DependencyTable);
