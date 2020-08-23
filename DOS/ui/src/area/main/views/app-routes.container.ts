import { connect } from 'react-redux';
// import { loadCatalogAction } from 'src/area/auditories/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsSFPAction } from 'src/area/observations-sfp/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsASFAction } from 'src/area/observations-asf/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsASENLAction } from 'src/area/observations-asenl/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsCYTGAction } from 'src/area/observations-cytg/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogResultsReportAction } from 'src/area/results-report/state/usecases/load-catalog.usecase';
import { loadCatalogResultsReportASENLAction } from 'src/area/results-report-asenl/state/usecases/load-catalog.usecase';
import { loadCatalogResultsReportCYTGAction } from 'src/area/results-report-cytg/state/usecases/load-catalog.usecase';
import { loadAuditCatalogAction } from 'src/area/auditories/state/usecases/load-audit-catalog.usecase';
import { loadUsersCatalogAction } from 'src/area/users/state/usecases/load-users-catalog.usecase';
import { checkAuthAction } from 'src/area/auth/state/usecases/check-auth.usecase';
import { checkedSelector, isLoggedInSelector } from 'src/area/auth/state/auth.selectors';
import { AppRoutes } from './app-routes.component';

const mapDispatchToProps = {
  loadAuditCatalogAction,
  // loadCatalogAction,
  loadCatalogObsSFPAction,
  loadCatalogObsASFAction,
  loadCatalogResultsReportAction,
  loadUsersCatalogAction,
  loadCatalogObsASENLAction,
  loadCatalogResultsReportASENLAction,
  loadCatalogObsCYTGAction,
  loadCatalogResultsReportCYTGAction,
  checkAuthAction,
};

function mapStateToProps(state: any) {
  return {
    isLoggedIn: isLoggedInSelector(state),
    checked: checkedSelector(state)
  };
}

export const AppRoutesContainer = connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
