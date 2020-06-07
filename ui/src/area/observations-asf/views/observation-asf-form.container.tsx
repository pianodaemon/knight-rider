import { connect } from 'react-redux';
import { ObservationsASFForm } from './observation-asf-form.component';
import { createObservationSFPAction } from '../state/usecases/create-observation-sfp.usecase';
import { readObservationASFAction } from '../state/usecases/read-observation-asf.usecase';
import { updateObservationSFPAction } from '../state/usecases/update-observation-sfp.usecate';

import {
  catalogSelector,
  observationSFPSelector,
} from '../state/observations-asf.selectors';

const mapDispatchToProps = {
  createObservationSFPAction,
  readObservationASFAction,
  updateObservationSFPAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    observation: observationSFPSelector(state),
  };
}

export const ObservationsASFFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsASFForm);
