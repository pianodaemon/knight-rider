import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeUser } from '../../service/user.service';
import { userReducer } from '../users.reducer';
import { loadUsersAction } from './load-users.usecase';

const postfix = '/app';
const REMOVE_USER = `REMOVE_USER${postfix}`;
const RREMOVE_USER_SUCCESS = `RREMOVE_USER_SUCCESS${postfix}`;
const REMOVE_USER_ERROR = `REMOVE_USER_ERROR${postfix}`;

export const removeUserAction: ActionFunctionAny<Action<any>> = createAction(
  REMOVE_USER
);
export const removeUserSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(RREMOVE_USER_SUCCESS);
export const removeUserErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_USER_ERROR);

function* removeUserWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(removeUser, action.payload);
    yield put(removeUserSuccessAction(result));
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${result.id} ha sido eliminado!`,
      }),
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      }),
    );
    yield console.log(e);
  }
}

function* removeUserWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_USER, removeUserWorker);
}

const usersReducerHandlers = {
  [REMOVE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [RREMOVE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeUserWatcher);
userReducer.addHandlers(usersReducerHandlers);
