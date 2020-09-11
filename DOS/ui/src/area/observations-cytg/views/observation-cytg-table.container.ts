import { connect } from 'react-redux';
import { ObservationCYTGTable } from './observation-cytg-table.component';
import { loadObservationsCYTGAction } from '../state/usecases/load-observations-cytg.usecase';
import { removeObservationCYTGAction } from '../state/usecases/remove-observation-cytg.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-cytg.selectors';

const mapDispatchToProps = {
  loadObservationsCYTGAction,
  removeObservationCYTGAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ObservationCYTGTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationCYTGTable);
