import { connect } from 'react-redux';
import { ResultsReportASENLForm } from './results-report-asenl-form.component';
import { createResultsReportASENLAction } from '../state/usecases/create-results-report-asenl.usecase';
import { readResultsReportASENLAction } from '../state/usecases/read-results-report-asenl.usecase';
import { updateResultsReportASENLAction } from '../state/usecases/update-results-report-asenl.usecate';
import { loadPreObservationsASENLAction } from '../state/usecases/load-pre-observations.usecase';
import {
  catalogSelector,
  reportSelector,
  preObservationsSelector,
  isLoadingPreSelector,
  canLoadMoreSelector,
  auditIdSelector,
} from '../state/results-report-asenl.selectors';

const mapDispatchToProps = {
  createResultsReportASENLAction,
  readResultsReportASENLAction,
  updateResultsReportASENLAction,
  loadPreObservationsASENLAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    report: reportSelector(state),
    observations: preObservationsSelector(state),
    isLoadingPre: isLoadingPreSelector(state),
    canLoadMore: canLoadMoreSelector(state),
    auditId: auditIdSelector(state),
  };
}

export const ResultsReportASENLFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportASENLForm);
