import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getInternalClas } from '../../service/internal-clas.service';
import { internalClasReducer } from '../internal-clas.reducer';
import { pagingSelector, filterOptionsSelector } from '../internal-clas.selectors';

const postfix = '/app';
const LOAD_INTERNAL_CLAS = `LOAD_INTERNAL_CLAS${postfix}`;
const LOAD_INTERNAL_CLAS_SUCCESS = `LOAD_INTERNAL_CLAS_SUCCESS${postfix}`;
const LOAD_INTERNAL_CLAS_ERROR = `LOAD_INTERNAL_CLAS_ERROR${postfix}`;

export const loadInternalClasAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_INTERNAL_CLAS);
export const loadInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_INTERNAL_CLAS_SUCCESS);
export const loadInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_INTERNAL_CLAS_ERROR);

function* loadInternalClasWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const divisionId = yield select(currentUserDivisionIdSelector);
    const f = yield select(filterOptionsSelector);
    console.log('divisionId', divisionId);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(divisionId === 0 || !divisionId ? {} : {direccion_id: divisionId}),
      ...(filters ? filters : f),
    };
    const result = yield call(getInternalClas, options);
    yield put(
      loadInternalClasSuccessAction({
        internalClasses: result.data,
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
    yield put(loadInternalClasErrorAction());
  }
}

function* loadInternalClasWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_INTERNAL_CLAS, loadInternalClasWorker);
}

const internalClasReducerHandlers = {
  [LOAD_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_INTERNAL_CLAS_SUCCESS]: (state: any, action: any) => {
    const { internalClasses, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      internalClasses,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_INTERNAL_CLAS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadInternalClasWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
