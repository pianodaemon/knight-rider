import { connect } from 'react-redux';
import { ResultsReportASENLTable } from './results-report-asenl-table.component';
import { loadResultsReportASENLAction } from '../state/usecases/load-results-report-asenl.usecase';
import { removeResultsReportASENLAction } from '../state/usecases/remove-results-report-asenl.usecase';

import {
  isLoadingSelector,
  reportsCatalogSelector,
  pagingSelector,
} from '../state/results-report-asenl.selectors';

const mapDispatchToProps = {
  loadResultsReportASENLAction,
  removeResultsReportASENLAction,
};

function mapStateToProps(state: any) {
  return {
    reports: reportsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
  };
}

export const ResultsReportASENLTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportASENLTable);
