import { connect } from 'react-redux';
import { ObservationASFTable } from './observation-asf-table.component';
import { loadObservationsASFAction } from '../state/usecases/load-observations-asf.usecase';
import { removeObservationASFAction } from '../state/usecases/remove-observation-asf.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  observationsCatalogSelector,
  pagingSelector,
} from '../state/observations-asf.selectors';

const mapDispatchToProps = {
  loadObservationsASFAction,
  removeObservationASFAction,
};

function mapStateToProps(state: any) {
  return {
    observations: observationsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ObservationASFTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationASFTable);
