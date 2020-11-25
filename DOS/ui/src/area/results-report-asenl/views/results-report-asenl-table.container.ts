import { connect } from 'react-redux';
import { ResultsReportASENLTable } from './results-report-asenl-table.component';
import { loadResultsReportASENLAction } from '../state/usecases/load-results-report-asenl.usecase';
import { removeResultsReportASENLAction } from '../state/usecases/remove-results-report-asenl.usecase';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

import {
  isLoadingSelector,
  reportsCatalogSelector,
  pagingSelector,
  filterSelector,
} from '../state/results-report-asenl.selectors';

const mapDispatchToProps = {
  loadResultsReportASENLAction,
  removeResultsReportASENLAction,
};

function mapStateToProps(state: any) {
  return {
    filters: filterSelector(state),
    reports: reportsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const ResultsReportASENLTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsReportASENLTable);
