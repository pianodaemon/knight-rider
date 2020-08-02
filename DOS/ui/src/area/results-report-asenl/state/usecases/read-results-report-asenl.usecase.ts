import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readResultsReportASENL } from '../../service/results-report-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';
import { loadPreObservationASENLAction } from './load-pre-observation.usecase';

const postfix = '/app';
const READ_RESULTS_REPORT_ASENL = `READ_RESULTS_REPORT_ASENL${postfix}`;
const READ_RESULTS_REPORT_ASENL_SUCCESS = `READ_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const READ_RESULTS_REPORT_ASENL_ERROR = `READ_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const readResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_ASENL);
export const readResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_ASENL_SUCCESS);
export const readResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_ASENL_ERROR);

function* readResultsReportASENLWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readResultsReportASENL, id);
    yield put(readResultsReportASENLSuccessAction(result));
    yield put(loadPreObservationASENLAction({ id: result.observacion_pre_id }));
  } catch (e) {
    const { history } = action.payload;
    yield put(readResultsReportASENLErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/results-report-asenl/list');
  }
}

function* readResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_RESULTS_REPORT_ASENL, readResultsReportASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [READ_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
      report: null,
    };
  },
  [READ_RESULTS_REPORT_ASENL_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [READ_RESULTS_REPORT_ASENL_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
