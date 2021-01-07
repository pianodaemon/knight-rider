import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getActions } from '../../service/actions.service';
import { actionsReducer } from '../actions.reducer';
import { pagingSelector, filterOptionsSelector } from '../actions.selectors';

const postfix = '/app';
const LOAD_ACTIONS = `LOAD_ACTIONS${postfix}`;
const LOAD_ACTIONS_SUCCESS = `LOAD_ACTIONS_SUCCESS${postfix}`;
const LOAD_ACTIONS_ERROR = `LOAD_ACTIONS_ERROR${postfix}`;

export const loadActionsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_ACTIONS);
export const loadActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_ACTIONS_SUCCESS);
export const loadActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_ACTIONS_ERROR);

function* loadActionWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getActions, options);
    yield put(
      loadActionSuccessAction({
        actions: result.data,
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
    yield put(loadActionErrorAction());
  }
}

function* loadActionWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_ACTIONS, loadActionWorker);
}

const actionReducerHandlers = {
  [LOAD_ACTIONS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_ACTIONS_SUCCESS]: (state: any, action: any) => {
    const { actions, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      actions,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_ACTIONS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadActionWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
