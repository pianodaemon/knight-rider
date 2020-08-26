import { connect } from 'react-redux';
import { checkedSelector, isLoggedInSelector, refreshingSelector } from 'src/area/auth/state/auth.selectors';
import { AppBarComponent } from './appbar.component';
import { logoutAction } from 'src/area/auth/state/usecases/logout.usecase';
import { refreshTokenAuthAction } from 'src/area/auth/state/usecases/refresh-token-auth.usecase';

const mapDispatchToProps = {
  logoutAction,
  refreshTokenAuthAction,
};

function mapStateToProps(state: any) {
  return {
    checked: checkedSelector(state),
    isLoggedIn: isLoggedInSelector(state),
    refreshing: refreshingSelector(state),
  };
}

export const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppBarComponent);
