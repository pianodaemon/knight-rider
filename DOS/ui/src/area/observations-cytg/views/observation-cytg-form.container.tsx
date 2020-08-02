import { connect } from 'react-redux';
import { ObservationsCYTGForm } from './observation-cytg-form.component';
import { createObservationCYTGAction } from '../state/usecases/create-observation-cytg.usecase';
import { readObservationCYTGAction } from '../state/usecases/read-observation-cytg.usecase';
import { updateObservationCYTGAction } from '../state/usecases/update-observation-cytg.usecate';

import {
  catalogSelector,
  observationCYTGSelector,
} from '../state/observations-cytg.selectors';

const mapDispatchToProps = {
  createObservationCYTGAction,
  readObservationCYTGAction,
  updateObservationCYTGAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationCYTGSelector(state),
  };
}

export const ObservationCYTGFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsCYTGForm);
