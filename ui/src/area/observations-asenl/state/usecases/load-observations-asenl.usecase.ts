import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from '../../service/observations-asenl.service';
import { observationsASENLReducer } from '../observations-asenl.reducer';
import { pagingSelector } from '../observations-asenl.selectors';

const postfix = '/app';
const LOAD_OBSERVATIONS_ASENL = `LOAD_OBSERVATIONS_ASENL${postfix}`;
const LOAD_OBSERVATIONS_ASENL_SUCCESS = `LOAD_OBSERVATIONS_ASENL_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_ASENL_ERROR = `LOAD_OBSERVATIONS_ASENL_ERROR${postfix}`;

export const loadObservationsASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASENL);
export const loadObservationsASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASENL_SUCCESS);
export const loadObservationsASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASENL_ERROR);

function* loadObservationsASENLWorker(action?: any): Generator<any, any, any> {
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
      loadObservationsASENLSuccessAction({
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
    yield put(loadObservationsASENLErrorAction());
  }
}

function* loadObservationsASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS_ASENL, loadObservationsASENLWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_ASENL_SUCCESS]: (state: any, action: any) => {
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
  [LOAD_OBSERVATIONS_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsASENLWatcher);
observationsASENLReducer.addHandlers(observationsReducerHandlers);
