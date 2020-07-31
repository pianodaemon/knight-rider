import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createResultsReportCYTG } from '../../service/results-report-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import { loadResultsReportCYTGAction } from './load-results-report-cytg.usecase';

const postfix = '/app';
const CREATE_RESULTS_REPORT_CYTG = `CREATE_RESULTS_REPORT_CYTG${postfix}`;
const CREATE_RESULTS_REPORT_CYTG_SUCCESS = `CREATE_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const CREATE_RESULTS_REPORT_CYTG_ERROR = `CREATE_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const createResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_CYTG);
export const createResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_CYTG_SUCCESS);
export const createResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_CYTG_ERROR);

function* createResultsReportCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createResultsReportCYTG, fields);
    yield put(createResultsReportCYTGSuccessAction(result));
    yield history.push('/results-report-cytg/list');
    yield put(loadResultsReportCYTGAction());
    yield put(
      notificationAction({
        message: `¡Informe de Resultados CYTG ${result.id} ha sido creada!`,
        type: 'success',
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
    yield put(createResultsReportCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_RESULTS_REPORT_CYTG, createResultsReportCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [CREATE_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_RESULTS_REPORT_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [CREATE_RESULTS_REPORT_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
