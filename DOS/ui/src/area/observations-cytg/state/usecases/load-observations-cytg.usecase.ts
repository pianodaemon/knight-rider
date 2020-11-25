import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getObservations } from '../../service/observations-cytg.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';
import { pagingSelector, filterOptionsSelector } from '../observations-cytg.selectors';

const postfix = '/app';
const LOAD_OBSERVATIONS_CYTG = `LOAD_OBSERVATIONS_CYTG${postfix}`;
const LOAD_OBSERVATIONS_CYTG_SUCCESS = `LOAD_OBSERVATIONS_CYTG_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_CYTG_ERROR = `LOAD_OBSERVATIONS_CYTG_ERROR${postfix}`;

export const loadObservationsCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_CYTG);
export const loadObservationsCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_CYTG_SUCCESS);
export const loadObservationsCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_CYTG_ERROR);

function* loadObservationsCYTGWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const divisionId = yield select(currentUserDivisionIdSelector);
    const f = yield select(filterOptionsSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(divisionId === 0 ? {} : {direccion_id: divisionId}),
      ...(filters ? filters : f),
    };
    const result = yield call(getObservations, options);
    yield put(
      loadObservationsCYTGSuccessAction({
        observations: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        filters: {
          ...(filters ? filters: f)
        }
      })
    );
  } catch (e) {
    yield put(loadObservationsCYTGErrorAction());
  }
}

function* loadObservationsCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS_CYTG, loadObservationsCYTGWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_CYTG_SUCCESS]: (state: any, action: any) => {
    const { observations, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      observations,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_OBSERVATIONS_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsCYTGWatcher);
observationsCYTGReducer.addHandlers(observationsReducerHandlers);
