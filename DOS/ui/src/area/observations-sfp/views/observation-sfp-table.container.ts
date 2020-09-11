import { connect } from 'react-redux';
import { ObservationSFPTable } from './observation-sfp-table.component';
import { loadObservationsSFPAction } from '../state/usecases/load-observations-sfp.usecase';
import { removeObservationSFPAction } from '../state/usecases/remove-observation.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-sfp.selectors';

const mapDispatchToProps = {
  loadObservationsSFPAction,
  removeObservationSFPAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ObservationSFPTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationSFPTable);
