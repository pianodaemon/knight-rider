import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { pagingSelector } from '../observations-asf.selectors';

const postfix = '/app';
const LOAD_OBSERVATIONS_ASF = `LOAD_OBSERVATIONS_ASF${postfix}`;
const LOAD_OBSERVATIONS_ASF_SUCCESS = `LOAD_OBSERVATIONS_ASF_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_ASF_ERROR = `LOAD_OBSERVATIONS_ASF_ERROR${postfix}`;

export const loadObservationsASFAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASF);
export const loadObservationsASFSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASF_SUCCESS);
export const loadObservationsASFErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ASF_ERROR);

function* loadObservationsASFWorker(action?: any): Generator<any, any, any> {
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
      loadObservationsASFSuccessAction({
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
    yield put(loadObservationsASFErrorAction());
  }
}

function* loadObservationsASFWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS_ASF, loadObservationsASFWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_ASF_SUCCESS]: (state: any, action: any) => {
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
  [LOAD_OBSERVATIONS_ASF_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsASFWatcher);
observationsASFReducer.addHandlers(observationsReducerHandlers);
