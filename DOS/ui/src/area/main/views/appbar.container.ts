import { connect } from 'react-redux';
import { checkedSelector, isLoggedInSelector } from 'src/area/auth/state/auth.selectors';
import { AppBarComponent } from './appbar.component';
import { logoutAction } from 'src/area/auth/state/usecases/logout.usecase';

const mapDispatchToProps = {
  logoutAction,
};

function mapStateToProps(state: any) {
  return {
    checked: checkedSelector(state),
    isLoggedIn: isLoggedInSelector(state)
  };
}

export const AppBarContainer = connect(mapStateToProps, mapDispatchToProps)(AppBarComponent);
