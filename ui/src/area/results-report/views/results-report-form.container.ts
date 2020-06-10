import { connect } from 'react-redux';
import { ResultsReportForm } from './results-report-form.component';
import { createResultsReportAction } from '../state/usecases/create-results-report.usecase';
import { readResultsReportAction } from '../state/usecases/read-results-report.usecase';
import { updateResultsReportAction } from '../state/usecases/update-results-report.usecate';

import {
  catalogSelector,
  reportSelector,
} from '../state/results-report.selectors';

const mapDispatchToProps = {
  createResultsReportAction,
  readResultsReportAction,
  updateResultsReportAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    report: reportSelector(state),
  };
}

export const ResultsReportFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportForm);
