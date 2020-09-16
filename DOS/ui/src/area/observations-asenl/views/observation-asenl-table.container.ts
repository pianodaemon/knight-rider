import { connect } from 'react-redux';
import { permissionSelector, currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { ObservationASENLTable } from './observation-asenl-table.component';
import { loadObservationsASENLAction } from '../state/usecases/load-observations-asenl.usecase';
import { removeObservationASENLAction } from '../state/usecases/remove-observation-asenl.usecase';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-asenl.selectors';

const mapDispatchToProps = {
  loadObservationsASENLAction,
  removeObservationASENLAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    divisionId: currentUserDivisionIdSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ObservationASENLTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationASENLTable);
