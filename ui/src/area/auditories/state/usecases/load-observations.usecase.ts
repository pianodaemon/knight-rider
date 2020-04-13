import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from '../../service/observations.service';
import { observationsReducer } from '../observations.reducer';
import { pagingSelector } from '../observations.selectors';

const postfix = '/app';
const LOAD_OBSERVATIONS = `LOAD_OBSERVATIONS${postfix}`;
const LOAD_OBSERVATIONS_SUCCESS = `LOAD_OBSERVATIONS_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_ERROR = `LOAD_OBSERVATIONS_ERROR${postfix}`;

export const loadObservationsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS);
export const loadObservationsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_SUCCESS);
export const loadObservationsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ERROR);

function* loadObservationsWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
    };
    const result = yield call(getObservations, options);
    yield put(
      loadObservationsSuccessAction({
        observations: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
      })
    );
  } catch (e) {
    yield put(loadObservationsErrorAction());
  }
}

function* loadObservationsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS, loadObservationsWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_SUCCESS]: (state: any, action: any) => {
    const { observations, paging } = action.payload;
    return {
      ...state,
      loading: false,
      observations,
      paging: {
        ...paging,
      },
    };
  },
  [LOAD_OBSERVATIONS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
