import { connect } from 'react-redux';
import { ObservationSFPTable } from './observation-sfp-table.component';
import { loadObservationsAction } from '../state/usecases/load-observations-sfp.usecase';
import { removeObservationAction } from '../state/usecases/remove-observation.usecase';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-sfp.selectors';

const mapDispatchToProps = {
  loadObservationsAction,
  removeObservationAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
  };
}

export const ObservationSFPTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationSFPTable);
