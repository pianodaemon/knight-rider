import { connect } from 'react-redux';
import { StatusForm } from './status-form.component';
import { createStatusAction } from '../state/usecases/create-status.usecase';
import { readStatusAction } from '../state/usecases/read-status.usecase';
import { updateStatusAction } from '../state/usecases/update-status.usecase';
import { catalogSelector, statusSelector } from '../state/status.selectors';

const mapDispatchToProps = {
  createStatusAction,
  readStatusAction,
  updateStatusAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    status: statusSelector(state),
  };
}

export const StatusFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusForm);
