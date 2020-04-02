import { connect } from 'react-redux';
import { loadCatalogAction } from 'src/area/auditories/state/usecases/load-catalog.usecase';
import { AppRoutes } from './app-routes.component';

const mapDispatchToProps = {
  loadCatalogAction,
};

export const AppRoutesContainer = connect(null, mapDispatchToProps)(AppRoutes);
