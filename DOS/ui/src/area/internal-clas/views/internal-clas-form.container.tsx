import { connect } from 'react-redux';
import { InternalClasForm } from './internal-clas-form.component';
import { createInternalClasAction } from '../state/usecases/create-internal-clas.usecase';
import { readInternalClasAction } from '../state/usecases/read-internal-clas.usecase';
import { updateInternalClasAction } from '../state/usecases/update-internal-clas.usecase';
import { catalogSelector, internalClasSelector } from '../state/internal-clas.selectors';

const mapDispatchToProps = {
  createInternalClasAction,
  readInternalClasAction,
  updateInternalClasAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    internalClas: internalClasSelector(state),
  };
}

export const InternalClasFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InternalClasForm);
