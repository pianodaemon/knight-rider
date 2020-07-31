import { connect } from 'react-redux';
import { ResultsReportCYTGTable } from './results-report-cytg-table.component';
import { loadResultsReportCYTGAction } from '../state/usecases/load-results-report-cytg.usecase';
import { removeResultsReportCYTGAction } from '../state/usecases/remove-results-report-cytg.usecase';

import {
  isLoadingSelector,
  reportsCatalogSelector,
  pagingSelector,
} from '../state/results-report-cytg.selectors';

const mapDispatchToProps = {
  loadResultsReportCYTGAction,
  removeResultsReportCYTGAction,
};

function mapStateToProps(state: any) {
  return {
    reports: reportsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
  };
}

export const ResultsReportCYTGTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportCYTGTable);
