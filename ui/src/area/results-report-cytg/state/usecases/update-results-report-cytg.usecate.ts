import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateResultsReportCYTG } from '../../service/results-report-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import { loadResultsReportCYTGAction } from './load-results-report-cytg.usecase';

const postfix = '/app';
const UPDATE_RESULTS_REPORT_CYTG = `UPDATE_RESULTS_REPORT_CYTG${postfix}`;
const UPDATE_RESULTS_REPORT_CYTG_SUCCESS = `UPDATE_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const UPDATE_RESULTS_REPORT_CYTG_ERROR = `UPDATE_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const updateResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_CYTG);
export const updateResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_CYTG_SUCCESS);
export const updateResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_CYTG_ERROR);

function* updateResultsReportCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateResultsReportCYTG, id, fields);
    yield put(updateResultsReportCYTGSuccessAction(result));
    yield history.push('/results-report-cytg/list');
    yield put(loadResultsReportCYTGAction());
    yield put(
      notificationAction({
        message: `¡Informe de Resultados CYTG ${result.id} ha sido actualizado!`,
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield releaseForm();
    yield put(updateResultsReportCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_RESULTS_REPORT_CYTG, updateResultsReportCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [UPDATE_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_RESULTS_REPORT_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [UPDATE_RESULTS_REPORT_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
