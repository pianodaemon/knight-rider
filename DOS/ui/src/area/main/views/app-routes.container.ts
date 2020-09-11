import { connect } from 'react-redux';
import { checkAuthAction } from 'src/area/auth/state/usecases/check-auth.usecase';
import { checkedSelector, isLoggedInSelector } from 'src/area/auth/state/auth.selectors';
import { AppRoutes } from './app-routes.component';
import { permissionSelector } from 'src/area/auth/state/auth.selectors';

const mapDispatchToProps = {
  checkAuthAction,
};

function mapStateToProps(state: any) {
  return {
    isLoggedIn: isLoggedInSelector(state),
    checked: checkedSelector(state),
    isAllowed: permissionSelector(state),
  };
}

export const AppRoutesContainer = connect(mapStateToProps, mapDispatchToProps)(AppRoutes);
