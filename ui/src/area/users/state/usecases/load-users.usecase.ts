import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getUsers } from '../../service/user.service';
import { userReducer } from '../users.reducer';
import { pagingSelector } from '../users.selectors';

const postfix = '/app';
const LOAD_USERS = `LOAD_USERS${postfix}`;
const LOAD_USERS_SUCCESS = `LOAD_USERS_SUCCESS${postfix}`;
const LOAD_USERS_ERROR = `LOAD_USERS_ERROR${postfix}`;

export const loadUsersAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_USERS
);
export const loadUsersSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_SUCCESS);
export const loadUsersErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_ERROR);

function* loadUsersWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getUsers, options);
    yield put(
      loadUsersSuccessAction({
        users: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
      }),
    );
  } catch (e) {
    yield put(loadUsersErrorAction());
  }
}

function* loadUsersWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USERS, loadUsersWorker);
}

const usersReducerHandlers = {
  [LOAD_USERS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_USERS_SUCCESS]: (state: any, action: any) => {
    const { users, paging } = action.payload;
    return {
      ...state,
      loading: false,
      users,
      paging: {
        ...paging,
      },
    };
  },
  [LOAD_USERS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUsersWatcher);
userReducer.addHandlers(usersReducerHandlers);
