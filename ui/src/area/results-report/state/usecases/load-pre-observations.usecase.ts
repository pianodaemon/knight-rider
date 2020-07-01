import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from 'src/area/observations-asf/service/observations-asf.service';
import { resultsReportReducer } from '../results-report.reducer';
import { pagingPreObsSelector } from '../results-report.selectors';

const postfix = '/app';
const LOAD_PRE_OBSERVATIONS = `LOAD_PRE_OBSERVATIONS${postfix}`;
const LOAD_PRE_OBSERVATIONS_SUCCESS = `LOAD_PRE_OBSERVATIONS_SUCCESS${postfix}`;
const LOAD_PRE_OBSERVATIONS_ERROR = `LOAD_PRE_OBSERVATIONS_ERROR${postfix}`;

export const loadPreObservationsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS);
export const loadPreObservationsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS_SUCCESS);
export const loadPreObservationsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS_ERROR);

function* loadPreObservationsWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by, auditoria_id } =
      action.payload || {};
    const paging = yield select(pagingPreObsSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(auditoria_id ? { auditoria_id } : {}),
    };
    const result = yield call(getObservations, options);
    yield put(
      loadPreObservationsSuccessAction({
        observations: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        ...(auditoria_id ? { auditoria_id } : {}),
      })
    );
  } catch (e) {
    yield put(loadPreObservationsErrorAction());
  }
}

function* loadResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PRE_OBSERVATIONS, loadPreObservationsWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_PRE_OBSERVATIONS]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: true,
      },
    };
  },
  [LOAD_PRE_OBSERVATIONS_SUCCESS]: (state: any, action: any) => {
    const { observations, paging, auditoria_id } = action.payload;
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        auditoria_id,
        error: false,
        loading: false,
        observations,
        paging: {
          ...paging,
        },
      }
    };
  },
  [LOAD_PRE_OBSERVATIONS_ERROR]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        error: true,
      },
    };
  },
};

mergeSaga(loadResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
