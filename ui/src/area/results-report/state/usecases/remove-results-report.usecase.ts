import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deletResultsReport } from '../../service/results-report.service';
import { resultsReportReducer } from '../results-report.reducer';
import { loadResultsReportAction } from './load-results-report.usecase';

const postfix = '/app';
const REMOVE_RESULTS_REPORT = `REMOVE_RESULTS_REPORT${postfix}`;
const REMOVE_RESULTS_REPORT_SUCCESS = `REMOVE_RESULTS_REPORT_SUCCESS${postfix}`;
const REMOVE_RESULTS_REPORT_ERROR = `REMOVE_RESULTS_REPORT_ERROR${postfix}`;

export const removeResultsReportAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT);
export const removeResultsReportSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_SUCCESS);
export const removeResultsReportErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_ERROR);

function* removeResultsReportWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deletResultsReport, action.payload);
    yield put(removeResultsReportErrorAction(result));
    yield put(loadResultsReportAction());
    yield put(
      notificationAction({
        message: `Informe de Resultados ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeResultsReportErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_RESULTS_REPORT, removeResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [REMOVE_RESULTS_REPORT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_RESULTS_REPORT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_RESULTS_REPORT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
