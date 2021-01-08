import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getStatuses } from '../../service/status.service';
import { statusReducer } from '../status.reducer';
import { pagingSelector, filterOptionsSelector } from '../status.selectors';

const postfix = '/app';
const LOAD_STATUSES = `LOAD_STATUSES${postfix}`;
const LOAD_STATUSES_SUCCESS = `LOAD_STATUSES_SUCCESS${postfix}`;
const LOAD_STATUSES_ERROR = `LOAD_STATUSES_ERROR${postfix}`;

export const loadStatusesAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_STATUSES);
export const loadStatusesSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_STATUSES_SUCCESS);
export const loadStatusesErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_STATUSES_ERROR);

function* loadStatusesWorker(action?: any): Generator<any, any, any> {
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
      ...(divisionId === 0 || !divisionId ? {} : {direccion_id: divisionId}),
      ...(filters ? filters : f),
    };
    const result = yield call(getStatuses, options);
    yield put(
      loadStatusesSuccessAction({
        statuses: result.data,
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
    yield put(loadStatusesErrorAction());
  }
}

function* loadStatusesWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_STATUSES, loadStatusesWorker);
}

const statusReducerHandlers = {
  [LOAD_STATUSES]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_STATUSES_SUCCESS]: (state: any, action: any) => {
    const { statuses, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      statuses,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_STATUSES_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadStatusesWatcher);
statusReducer.addHandlers(statusReducerHandlers);
