import { connect } from 'react-redux';
import { Report55 } from './reports55.component';
import { loadReport55Action } from '../state/usecases/load-reports55.usecase';
import {
  isLoadingSelector,
  report55Selector,
} from '../state/reports55.selectors';

const mapDispatchToProps = {
  loadReport55Action,
};

function mapStateToProps(state: any) {
  return {
    report: report55Selector(state),
    loading: isLoadingSelector(state),
  };
}

export const Reports55Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Report55);
