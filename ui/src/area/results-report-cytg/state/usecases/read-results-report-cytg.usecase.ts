import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readResultsReportCYTG } from '../../service/results-report-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import { loadPreObservationCYTGAction } from './load-pre-observation.usecase';

const postfix = '/app';
const READ_RESULTS_REPORT_CYTG = `READ_RESULTS_REPORT_CYTG${postfix}`;
const READ_RESULTS_REPORT_CYTG_SUCCESS = `READ_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const READ_RESULTS_REPORT_CYTG_ERROR = `READ_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const readResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_CYTG);
export const readResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_CYTG_SUCCESS);
export const readResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_CYTG_ERROR);

function* readResultsReportCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readResultsReportCYTG, id);
    yield put(readResultsReportCYTGSuccessAction(result));
    yield put(loadPreObservationCYTGAction({ id: result.observacion_pre_id }));
  } catch (e) {
    const { history } = action.payload;
    yield put(readResultsReportCYTGErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/results-report-cytg/list');
  }
}

function* readResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_RESULTS_REPORT_CYTG, readResultsReportCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [READ_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
      report: null,
    };
  },
  [READ_RESULTS_REPORT_CYTG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [READ_RESULTS_REPORT_CYTG_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
