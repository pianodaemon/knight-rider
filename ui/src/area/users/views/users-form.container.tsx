import { connect } from 'react-redux';
import { UserForm } from './user-form.component';
import { createUserAction } from '../../users/state/usecases/create-user.usecase';
import { readUserAction } from '../../users/state/usecases/read-user.usecase';
import { updateUserAction } from '../../users/state/usecases/update-user.usecate';
import {
  catalogSelector,
  userSelector,
} from '../../users/state/users.selectors';

const mapDispatchToProps = {
  createUserAction,
  readUserAction,
  updateUserAction,
};

function mapStateToProps(state: any) {
  return {
    user: userSelector(state),
    catalog: catalogSelector(state),
  };
}

export const UsersFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm);
