import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createResultsReport } from '../../service/results-report.service';
import { resultsReportReducer } from '../results-report.reducer';
import { loadResultsReportAction } from './load-results-report.usecase';

const postfix = '/app';
const CREATE_RESULTS_REPORT = `CREATE_RESULTS_REPORT${postfix}`;
const CREATE_RESULTS_REPORT_SUCCESS = `CREATE_RESULTS_REPORT_SUCCESS${postfix}`;
const CREATE_RESULTS_REPORT_ERROR = `CREATE_RESULTS_REPORT_ERROR${postfix}`;

export const createResultsReportAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT);
export const createResultsReportSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_SUCCESS);
export const createResultsReportErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_ERROR);

function* createResultsReportWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createResultsReport, fields);
    yield put(createResultsReportSuccessAction(result));
    yield history.push('/results-report/list');
    yield put(loadResultsReportAction());
    yield put(
      notificationAction({
        message: `¡Informe de Resultados ${result.id} ha sido creada!`,
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
    yield put(createResultsReportErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_RESULTS_REPORT, createResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [CREATE_RESULTS_REPORT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_RESULTS_REPORT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [CREATE_RESULTS_REPORT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
