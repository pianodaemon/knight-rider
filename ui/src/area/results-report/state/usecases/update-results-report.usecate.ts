import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateResultsReport } from '../../service/results-report.service';
import { resultsReportReducer } from '../results-report.reducer';
import { loadResultsReportAction } from './load-results-report.usecase';

const postfix = '/app';
const UPDATE_RESULTS_REPORT = `UPDATE_RESULTS_REPORT${postfix}`;
const UPDATE_RESULTS_REPORT_SUCCESS = `UPDATE_RESULTS_REPORT_SUCCESS${postfix}`;
const UPDATE_RESULTS_REPORT_ERROR = `UPDATE_RESULTS_REPORT_ERROR${postfix}`;

export const updateResultsReportAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT);
export const updateResultsReportSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_SUCCESS);
export const updateResultsReportErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_RESULTS_REPORT_ERROR);

function* updateResultsReportWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateResultsReport, id, fields);
    yield put(updateResultsReportSuccessAction(result));
    yield history.push('/results-report/list');
    yield put(loadResultsReportAction());
    yield put(
      notificationAction({
        message: `¡Informe de Resultados ${result.id} ha sido actualizado!`,
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
    yield put(updateResultsReportErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_RESULTS_REPORT, updateResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [UPDATE_RESULTS_REPORT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_RESULTS_REPORT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [UPDATE_RESULTS_REPORT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
