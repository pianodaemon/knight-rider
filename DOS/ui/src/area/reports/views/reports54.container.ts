import { connect } from 'react-redux';
import { Report54 } from './reports54.component';
import { loadReport54Action } from '../state/usecases/load-reports54.usecase';
import {
  isLoadingSelector,
  report54Selector,
} from '../state/reports54.selectors';

const mapDispatchToProps = {
  loadReport54Action,
};

function mapStateToProps(state: any) {
  return {
    report: report54Selector(state),
    loading: isLoadingSelector(state),
  };
}

export const Reports54Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Report54);
