import { connect } from 'react-redux';
import { ObservationsASFForm } from './observation-asf-form.component';
import { createObservationASFAction } from '../state/usecases/create-observation-asf.usecase';
import { readObservationASFAction } from '../state/usecases/read-observation-asf.usecase';
import { updateObservationASFAction } from '../state/usecases/update-observation-asf.usecate';

import {
  catalogSelector,
  observationASFSelector,
} from '../state/observations-asf.selectors';

const mapDispatchToProps = {
  createObservationASFAction,
  readObservationASFAction,
  updateObservationASFAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationASFSelector(state),
  };
}

export const ObservationsASFFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsASFForm);
