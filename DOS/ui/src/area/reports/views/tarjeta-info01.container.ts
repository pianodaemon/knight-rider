import { connect } from 'react-redux';
import { TarjetaInfo01 } from './tarjeta-info01.component';
import { loadReport61Action } from '../state/usecases/load-reports61.usecase';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import {
  isLoadingSelector,
  report61Selector,
} from '../state/reports61.selectors';

const mapDispatchToProps = {
  loadReport61Action,
};

function mapStateToProps(state: any) {
  return {
    report: report61Selector(state),
    loading: isLoadingSelector(state),
    divisionId: currentUserDivisionIdSelector(state),
  };
}

export const TarjetaInfo01Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(TarjetaInfo01);
