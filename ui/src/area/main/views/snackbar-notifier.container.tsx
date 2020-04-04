import { connect } from 'react-redux';
import { loadCatalogAction } from 'src/area/auditories/state/usecases/load-catalog.usecase';
import { SnackbarNotifier } from 'src/shared/components/snackbar/snackbar-notifier.component';

const mapDispatchToProps = {
  loadCatalogAction,
};

export const SnackbarContainer = connect(
  null,
  mapDispatchToProps
)(SnackbarNotifier);
