import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from 'src/area/observations-cytg/service/observations-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import {
  pagingPreObsSelector,
  observationPreAuditIdSelector,
} from '../results-report-cytg.selectors';

const postfix = '/app';
const LOAD_PRE_OBSERVATIONS_CYTG = `LOAD_PRE_OBSERVATIONS_CYTG${postfix}`;
const LOAD_PRE_OBSERVATIONS_CYTG_SUCCESS = `LOAD_PRE_OBSERVATIONS_CYTG_SUCCESS${postfix}`;
const LOAD_PRE_OBSERVATIONS_CYTG_ERROR = `LOAD_PRE_OBSERVATIONS_CYTG_ERROR${postfix}`;

export const loadPreObservationsCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS_CYTG);
export const loadPreObservationsCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS_CYTG_SUCCESS);
export const loadPreObservationsCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATIONS_CYTG_ERROR);

function* loadPreObservationsCYTGWorker(
  action?: any
): Generator<any, any, any> {
  try {
    const {
      per_page,
      page,
      order,
      order_by,
      auditoria_id,
      id,
      loadMore,
      observacion_pre_id,
    } = action.payload || {};
    const paging = yield select(pagingPreObsSelector);
    const audit_id = yield select(observationPreAuditIdSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page:
        auditoria_id === audit_id
          ? (page || paging.page) + (loadMore ? 1 : 0)
          : 1,
      pages: paging.pages,
      order: order || paging.order,
      ...(auditoria_id ? { auditoria_id } : {}),
      ...(id ? { id } : {}),
    };
    const result = yield call(getObservations, options);
    yield put(
      loadPreObservationsCYTGSuccessAction({
        observacion_pre_id,
        observations: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page:
            auditoria_id === audit_id
              ? (page || paging.page) + (loadMore ? 1 : 0)
              : 1,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        ...(auditoria_id ? { auditoria_id } : {}),
        ...(id ? { id } : {}),
        newSearch: auditoria_id !== audit_id,
      })
    );
  } catch (e) {
    console.log(e);
    yield put(loadPreObservationsCYTGErrorAction(e));
  }
}

function* loadResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PRE_OBSERVATIONS_CYTG, loadPreObservationsCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [LOAD_PRE_OBSERVATIONS_CYTG]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: true,
      },
    };
  },
  [LOAD_PRE_OBSERVATIONS_CYTG_SUCCESS]: (state: any, action: any) => {
    const {
      observations,
      paging,
      auditoria_id,
      newSearch,
      observacion_pre_id,
    } = action.payload;
    // Current Observation selected on dropdown
    const currentObservation = state.observacion_pre.observations.length
      ? [
          state.observacion_pre.observations.find(
            (item: any) =>
              parseInt(item.id, 10) === parseInt(observacion_pre_id, 10)
          ),
        ]
      : [];
    // Current Observation selected on dropdown (same to avoid ternary operator nesting)
    const selectedOption =
      state.observacion_pre.observations.length && observacion_pre_id
        ? currentObservation
        : [];
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        auditoria_id,
        error: false,
        loading: false,
        observations: [
          ...(newSearch ? selectedOption : state.observacion_pre.observations),
          ...observations,
        ],
        paging: {
          ...paging,
        },
      },
    };
  },
  [LOAD_PRE_OBSERVATIONS_CYTG_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        error: action.payload,
      },
    };
  },
};

mergeSaga(loadResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
