import { connect } from 'react-redux';
import { ActionsForm } from './actions-form.component';
import { createActionAction } from '../state/usecases/create-action.usecase';
import { readActionAction } from '../state/usecases/read-action.usecase';
import { updateActionAction } from '../state/usecases/update-action.usecase';
import { catalogSelector, actionSelector } from '../state/actions.selectors';

const mapDispatchToProps = {
  createActionAction,
  readActionAction,
  updateActionAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    actionRecord: actionSelector(state),
  };
}

export const ActionFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsForm);
