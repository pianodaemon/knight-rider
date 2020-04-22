import { connect } from 'react-redux';
import { loadCatalogAction } from 'src/area/auditories/state/usecases/load-catalog.usecase';
import { loadAuditCatalogAction } from 'src/area/auditories/state/usecases/load-audit-catalog.usecase';
import { loadUsersCatalogAction } from 'src/area/users/state/usecases/load-users-catalog.usecase';

import { AppRoutes } from './app-routes.component';

const mapDispatchToProps = {
  loadAuditCatalogAction,
  loadCatalogAction,
  loadUsersCatalogAction,
};

export const AppRoutesContainer = connect(null, mapDispatchToProps)(AppRoutes);
