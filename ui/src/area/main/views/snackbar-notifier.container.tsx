import { connect } from 'react-redux';
import { SnackbarNotifier } from 'src/shared/components/snackbar/snackbar-notifier.component';
import { notificationSelector } from '../state/main.selectors';
import { notificationCloseAction } from '../state/usecase/notification.usecase';

const mapDispatchToProps = { notificationCloseAction };

function mapStateToProps(state: any): any {
  return {
    notification: notificationSelector(state),
  };
}

export const SnackbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackbarNotifier);
