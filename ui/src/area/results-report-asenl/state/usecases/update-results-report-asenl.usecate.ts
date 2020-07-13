import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateResultsReportASENL } from '../../service/results-report-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';
import { loadResultsReportASENLAction } from './load-results-report-asenl.usecase';

const postfix = '/app';
const UPDATE_RESULTS_REPORT_ASENL = `UPDATE_RESULTS_REPORT_ASENL${postfix}`;
const UPDATE_RESULTS_REPORT_ASENL_SUCCESS = `UPDATE_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const UPDATE_RESULTS_REPORT_ASENL_ERROR = `UPDATE_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const updateResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_ASENL);
export const updateResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_ASENL_SUCCESS);
export const updateResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_ASENL_ERROR);

function* updateResultsReportASENLWorker(
  action: any
): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateResultsReportASENL, id, fields);
    yield put(updateResultsReportASENLSuccessAction(result));
    yield history.push('/results-report-asenl/list');
    yield put(loadResultsReportASENLAction());
    yield put(
      notificationAction({
        message: `¡Reporte de Resultados ASENL ${result.id} ha sido actualizado!`,
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
    yield put(updateResultsReportASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_RESULTS_REPORT_ASENL, updateResultsReportASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [UPDATE_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_RESULTS_REPORT_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [UPDATE_RESULTS_REPORT_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
