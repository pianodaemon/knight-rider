import { connect } from 'react-redux';
import { ObservationsForm } from './form.component';
import { createObservationAction } from '../state/usecases/create-observation.usecase';
import { catalogSelector } from '../state/observations.selectors';

const mapDispatchToProps = {
  createObservationAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
  };
}

export const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ObservationsForm);
