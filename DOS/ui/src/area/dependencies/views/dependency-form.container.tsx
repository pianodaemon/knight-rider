import { connect } from 'react-redux';
import { DependecyForm } from './dependency-form.component';
import { createDependencyAction } from '../state/usecases/create-dependency.usecase';
import { readDependencyAction } from '../state/usecases/read-dependency.usecase';
import { updateDependencyAction } from '../state/usecases/update-dependency.usecase';

import {
  catalogSelector,
  dependencySelector,
} from '../state/dependencies.selectors';

const mapDispatchToProps = {
  createDependencyAction,
  readDependencyAction,
  updateDependencyAction,
};

function mapStateToProps(state: any) {
  return {
    catalog: catalogSelector(state),
    dependency: dependencySelector(state),
  };
}

export const DependencyFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DependecyForm);
