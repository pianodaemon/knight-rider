import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deletResultsReportASENL } from '../../service/results-report-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';
import { loadResultsReportASENLAction } from './load-results-report-asenl.usecase';

const postfix = '/app';
const REMOVE_RESULTS_REPORT_ASENL = `REMOVE_RESULTS_REPORT_ASENL${postfix}`;
const REMOVE_RESULTS_REPORT_ASENL_SUCCESS = `REMOVE_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const REMOVE_RESULTS_REPORT_ASENL_ERROR = `REMOVE_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const removeResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_ASENL);
export const removeResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_ASENL_SUCCESS);
export const removeResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_ASENL_ERROR);

function* removeResultsReportASENLWorker(
  action: any
): Generator<any, any, any> {
  try {
    const result = yield call(deletResultsReportASENL, action.payload);
    yield put(removeResultsReportASENLSuccessAction(result));
    yield put(loadResultsReportASENLAction());
    yield put(
      notificationAction({
        message: `Observación de Resultados ASF ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeResultsReportASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_RESULTS_REPORT_ASENL, removeResultsReportASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [REMOVE_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_RESULTS_REPORT_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_RESULTS_REPORT_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
