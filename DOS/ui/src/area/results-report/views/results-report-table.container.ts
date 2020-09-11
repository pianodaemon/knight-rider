import { connect } from 'react-redux';
import { ResultsReportTable } from './results-report-table.component';
import { loadResultsReportAction } from '../state/usecases/load-results-report.usecase';
import { removeResultsReportAction } from '../state/usecases/remove-results-report.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  reportsCatalogSelector,
  pagingSelector,
} from '../state/results-report.selectors';

const mapDispatchToProps = {
  loadResultsReportAction,
  removeResultsReportAction,
};

function mapStateToProps(state: any) {
  return {
    reports: reportsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ResultsReportTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportTable);
