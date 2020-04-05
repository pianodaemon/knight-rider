import { connect } from 'react-redux';
import { ObservationsForm } from './form.component';
import { createObservationAction } from '../state/usecases/create-observation.usecase';
import { readObservationAction } from '../state/usecases/read-observation.usecase';

import {
  catalogSelector,
  observationSelector,
} from '../state/observations.selectors';

const mapDispatchToProps = {
  createObservationAction,
  readObservationAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationSelector(state),
  };
}

export const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ObservationsForm);
