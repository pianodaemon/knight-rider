import { connect } from 'react-redux';
import { permissionSelector, currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { ObservationASFTable } from './observation-asf-table.component';
import { loadObservationsASFAction } from '../state/usecases/load-observations-asf.usecase';
import { removeObservationASFAction } from '../state/usecases/remove-observation-asf.usecase';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/observations-asf.selectors';

const mapDispatchToProps = {
  loadObservationsASFAction,
  removeObservationASFAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    divisionId: currentUserDivisionIdSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ObservationASFTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationASFTable);
