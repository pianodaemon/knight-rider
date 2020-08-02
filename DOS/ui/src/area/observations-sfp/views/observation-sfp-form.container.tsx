import { connect } from 'react-redux';
import { ObservationsSFPForm } from './observation-sfp-form.component';
import { createObservationSFPAction } from '../state/usecases/create-observation-sfp.usecase';
import { readObservationSFPAction } from '../state/usecases/read-observation-sfp.usecase';
import { updateObservationSFPAction } from '../state/usecases/update-observation-sfp.usecate';

import {
  catalogSelector,
  observationSFPSelector,
} from '../state/observations-sfp.selectors';

const mapDispatchToProps = {
  createObservationSFPAction,
  readObservationSFPAction,
  updateObservationSFPAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationSFPSelector(state),
  };
}

export const ObservationsSFPFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsSFPForm);
