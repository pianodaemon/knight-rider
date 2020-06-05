import { connect } from 'react-redux';
import { ObservationASFTable } from './observation-asf-table.component';
import { loadObservationsASFAction } from '../state/usecases/load-observations-asf.usecase';
import { removeObservationSFPAction } from '../state/usecases/remove-observation.usecase';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-asf.selectors';

const mapDispatchToProps = {
  loadObservationsASFAction,
  removeObservationSFPAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
  };
}

export const ObservationASFTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationASFTable);
