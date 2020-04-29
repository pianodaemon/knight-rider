import { connect } from 'react-redux';
import { ResultsReportForm } from './results-report-form.component';
import { createObservationAction } from '../state/usecases/create-observation.usecase';
import { readObservationAction } from '../state/usecases/read-observation.usecase';
import { updateObservationAction } from '../state/usecases/update-observation.usecate';

import {
  catalogSelector,
  observationSelector,
} from '../state/observations.selectors';

import { catalogSelector as auditsCatalogSelector } from '../state/audits.selectors';

const mapDispatchToProps = {
  createObservationAction,
  readObservationAction,
  updateObservationAction,
};

function mapStateToProps(state: any) {
  return {
    auditsCatalog: auditsCatalogSelector(state),
    catalog: catalogSelector(state),
    observation: observationSelector(state),
  };
}

export const ResultsReportFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsReportForm);
