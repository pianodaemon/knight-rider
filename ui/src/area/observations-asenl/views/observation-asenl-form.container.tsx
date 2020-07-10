import { connect } from 'react-redux';
import { ObservationsASENLForm } from './observation-asenl-form.component';
import { createObservationASENLAction } from '../state/usecases/create-observation-asenl.usecase';
import { readObservationASENLAction } from '../state/usecases/read-observation-asenl.usecase';
import { updateObservationASENLAction } from '../state/usecases/update-observation-asenl.usecate';

import {
  catalogSelector,
  observationASENLSelector,
} from '../state/observations-asenl.selectors';

const mapDispatchToProps = {
  createObservationASENLAction,
  readObservationASENLAction,
  updateObservationASENLAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationASENLSelector(state),
  };
}

export const ObservationASENLFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsASENLForm);
