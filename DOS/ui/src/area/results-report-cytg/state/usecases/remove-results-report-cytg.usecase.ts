import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deletResultsReportCYTG } from '../../service/results-report-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import { loadResultsReportCYTGAction } from './load-results-report-cytg.usecase';

const postfix = '/app';
const REMOVE_RESULTS_REPORT_CYTG = `REMOVE_RESULTS_REPORT_CYTG${postfix}`;
const REMOVE_RESULTS_REPORT_CYTG_SUCCESS = `REMOVE_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const REMOVE_RESULTS_REPORT_CYTG_ERROR = `REMOVE_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const removeResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_CYTG);
export const removeResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_CYTG_SUCCESS);
export const removeResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_RESULTS_REPORT_CYTG_ERROR);

function* removeResultsReportCYTGWorker(
  action: any
): Generator<any, any, any> {
  try {
    const result = yield call(deletResultsReportCYTG, action.payload);
    yield put(removeResultsReportCYTGSuccessAction(result));
    yield put(loadResultsReportCYTGAction());
    yield put(
      notificationAction({
        message: `Informe de Resultados CYTG ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeResultsReportCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_RESULTS_REPORT_CYTG, removeResultsReportCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [REMOVE_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_RESULTS_REPORT_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_RESULTS_REPORT_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
