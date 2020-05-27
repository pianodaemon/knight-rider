import { connect } from 'react-redux';
import { ObservationsSFPForm } from './observation-sfp-form.component';
import { createObservationAction } from '../state/usecases/create-observation.usecase';
import { readObservationSFPAction } from '../state/usecases/read-observation-sfp.usecase';
import { updateObservationAction } from '../state/usecases/update-observation.usecate';

import {
  catalogSelector,
  observationSFPSelector,
} from '../state/observations-sfp.selectors';

import { catalogSelector as auditsCatalogSelector } from '../state/audits.selectors';

const mapDispatchToProps = {
  createObservationAction,
  readObservationSFPAction,
  updateObservationAction,
};

function mapStateToProps(state: any) {
  return {
    auditsCatalog: auditsCatalogSelector(state),
    catalog: catalogSelector(state),
    observation: observationSFPSelector(state),
  };
}

export const ObservationsSFPFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsSFPForm);
