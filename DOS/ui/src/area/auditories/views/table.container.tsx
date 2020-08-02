import { connect } from 'react-redux';
import { Table } from './table.component';
import { loadObservationsAction } from '../state/usecases/load-observations.usecase';
import { removeObservationAction } from '../state/usecases/remove-observation.usecase';

import {
  isLoadingSelector,
  observationsSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations.selectors';

const mapDispatchToProps = {
  loadObservationsAction,
  removeObservationAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsSelector(state),
    mutatedObservations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
  };
}

export const TableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);
