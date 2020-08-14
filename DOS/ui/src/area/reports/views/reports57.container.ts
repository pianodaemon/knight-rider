import { connect } from 'react-redux';
import { Report57 } from './reports57.component';
import { loadReport57Action } from '../state/usecases/load-reports57.usecase';
import {
  isLoadingSelector,
  report57Selector,
} from '../state/reports57.selectors';

const mapDispatchToProps = {
  loadReport57Action,
};

function mapStateToProps(state: any) {
  return {
    report: report57Selector(state),
    loading: isLoadingSelector(state),
  };
}

export const Reports57Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Report57);
