import { connect } from 'react-redux';
import { ResultsReportCYTGForm } from './results-report-cytg-form.component';
import { createResultsReportCYTGAction } from '../state/usecases/create-results-report-cytg.usecase';
import { readResultsReportCYTGAction } from '../state/usecases/read-results-report-cytg.usecase';
import { updateResultsReportCYTGAction } from '../state/usecases/update-results-report-cytg.usecate';
import { loadPreObservationsCYTGAction } from '../state/usecases/load-pre-observations.usecase';
import {
  catalogSelector,
  reportSelector,
  preObservationsSelector,
  isLoadingPreSelector,
  canLoadMoreSelector,
  auditIdSelector,
} from '../state/results-report-cytg.selectors';

const mapDispatchToProps = {
  createResultsReportCYTGAction,
  readResultsReportCYTGAction,
  updateResultsReportCYTGAction,
  loadPreObservationsCYTGAction,
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

export const ResultsReportCYTGFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportCYTGForm);
