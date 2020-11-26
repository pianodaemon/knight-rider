import { connect } from 'react-redux';
import { permissionSelector, currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { ObservationCYTGTable } from './observation-cytg-table.component';
import { loadObservationsCYTGAction } from '../state/usecases/load-observations-cytg.usecase';
import { removeObservationCYTGAction } from '../state/usecases/remove-observation-cytg.usecase';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/observations-cytg.selectors';

const mapDispatchToProps = {
  loadObservationsCYTGAction,
  removeObservationCYTGAction,
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

export const ObservationCYTGTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationCYTGTable);
