import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReports } from '../../service/reports.service';
import { resultsReducer } from '../reports.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { pagingSelector } from '../results-report.selectors';

const postfix = '/app';
const LOAD_REPORTS = `LOAD_REPORTS${postfix}`;
const LOAD_REPORTS_SUCCESS = `LOAD_REPORTS_SUCCESS${postfix}`;
const LOAD_REPORTS_ERROR = `LOAD_REPORTS_ERROR${postfix}`;

export const loadReportsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORTS);
export const loadReportsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORTS_SUCCESS);
export const loadReportsActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORTS_ERROR);

function* loadResultsReportWorker(action?: any): Generator<any, any, any> {
  try {
    const { ejercicio_fin, ejercicio_ini } = action.payload || {};
    // const paging = yield select(pagingSelector);

    const options = {
      ...action.payload,
      ejercicio_fin: ejercicio_fin,
      ejercicio_ini: ejercicio_ini,
    };

    if(ejercicio_fin < ejercicio_ini){
      yield put(
        notificationAction({
          message: `La fecha inicial debe ser menor`,
        }),
      );
      return;
    }

    const result = yield call(getReports, options);

    var dat = result.data;
    var sum_obj = {c_asf:0, m_asf:0, c_sfp:0, m_sfp:0, c_asenl:0, m_asenl:0, c_cytg:0, m_cytg:0 };
    dat.data_rows.forEach(function(x: any) {
      sum_obj.c_asf   += x.c_asf   ;
      sum_obj.m_asf   += x.m_asf   ;
      sum_obj.c_sfp   += x.c_sfp   ;
      sum_obj.m_sfp   += x.m_sfp   ;
      sum_obj.c_asenl += x.c_asenl ;
      sum_obj.m_asenl += x.m_asenl ;
      sum_obj.c_cytg  += x.c_cytg  ;
      sum_obj.m_cytg  += x.m_cytg  ;
    } )

    var sendData = {data_rows: result.data.data_rows, sum_rows: sum_obj};
    yield put(loadReportsSuccessAction( sendData ));
  } catch (e) {
    yield put(loadReportsActionErrorAction());
  }
}

function* loadResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORTS, loadResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_REPORTS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORTS_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORTS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadResultsReportWatcher);
resultsReducer.addHandlers(resultsReportReducerHandlers);
