import { connect } from 'react-redux';
import { LoginForm } from './login-form.component';
import { authTokenAction } from '../state/usecases/token-auth.usecase';
import {
  isLoadingSelector,
} from '../state/auth.selectors';

const mapDispatchToProps = {
  authTokenAction,
};

function mapStateToProps(state: any) {
  return {
    isLoading: isLoadingSelector(state),
  };
}

export const LoginFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
