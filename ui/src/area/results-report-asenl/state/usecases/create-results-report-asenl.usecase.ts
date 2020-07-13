import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createResultsReportASENL } from '../../service/results-report-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';
import { loadResultsReportASENLAction } from './load-results-report-asenl.usecase';

const postfix = '/app';
const CREATE_RESULTS_REPORT_ASENL = `CREATE_RESULTS_REPORT_ASENL${postfix}`;
const CREATE_RESULTS_REPORT_ASENL_SUCCESS = `CREATE_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const CREATE_RESULTS_REPORT_ASENL_ERROR = `CREATE_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const createResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_ASENL);
export const createResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_ASENL_SUCCESS);
export const createResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_RESULTS_REPORT_ASENL_ERROR);

function* createResultsReportASENLWorker(
  action: any
): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createResultsReportASENL, fields);
    yield put(createResultsReportASENLSuccessAction(result));
    yield history.push('/results-report-asenl/list');
    yield put(loadResultsReportASENLAction());
    yield put(
      notificationAction({
        message: `¡Informe de Resultados ASENL ${result.id} ha sido creada!`,
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
    yield put(createResultsReportASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_RESULTS_REPORT_ASENL, createResultsReportASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [CREATE_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_RESULTS_REPORT_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      report: null,
    };
  },
  [CREATE_RESULTS_REPORT_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
