import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readUser } from '../../service/user.service';
import { userReducer } from '../users.reducer';

const postfix = '/app';
const READ_USER = `READ_USER${postfix}`;
const READ_USER_SUCCESS = `READ_USER_SUCCESS${postfix}`;
const READ_USER_ERROR = `READ_USER_ERROR${postfix}`;

export const readUserAction: ActionFunctionAny<Action<any>> = createAction(
  READ_USER
);
export const readUserSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_USER_SUCCESS);
export const readUserErrorAction: ActionFunctionAny<Action<any>> = createAction(
  READ_USER_ERROR
);

function* readUserWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readUser, id);
    yield put(readUserSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/user/list');
    yield put(readUserErrorAction());
  }
}

function* readUserWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_USER, readUserWorker);
}

const usersReducerHandlers = {
  [READ_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
      user: null,
    };
  },
  [READ_USER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      user: action.payload,
    };
  },
  [READ_USER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readUserWatcher);
userReducer.addHandlers(usersReducerHandlers);
