import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readResultsReport } from '../../service/results-report.service';
import { resultsReportReducer } from '../results-report.reducer';
// import { loadPreObservationsAction } from './load-pre-observations.usecase';

const postfix = '/app';
const READ_RESULTS_REPORT = `READ_RESULTS_REPORT${postfix}`;
const READ_RESULTS_REPORT_SUCCESS = `READ_RESULTS_REPORT_SUCCESS${postfix}`;
const READ_RESULTS_REPORT_ERROR = `READ_RESULTS_REPORT_ERROR${postfix}`;

export const readResultsReportAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT);
export const readResultsReportSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_SUCCESS);
export const readResultsReportErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_RESULTS_REPORT_ERROR);

function* readResultsReportWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readResultsReport, id);
    yield put(readResultsReportSuccessAction(result));
    // yield put(loadPreObservationsAction({ auditoria_id: result.auditoria_id }));
  } catch (e) {
    const { history } = action.payload;
    yield put(readResultsReportErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/results-report/list');
  }
}

function* readResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_RESULTS_REPORT, readResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [READ_RESULTS_REPORT]: (state: any) => {
    return {
      ...state,
      loading: true,
      report: null,
    };
  },
  [READ_RESULTS_REPORT_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [READ_RESULTS_REPORT_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
