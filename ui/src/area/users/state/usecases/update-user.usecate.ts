import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateUser } from '../../service/user.service';
import { userReducer } from '../users.reducer';
import { loadUsersAction } from './load-users.usecase';

const postfix = '/app';
const UPDATE_USER = `UPDATE_USER${postfix}`;
const UPDATE_USER_SUCCESS = `UPDATE_USER_SUCCESS${postfix}`;
const UUPDATE_USER_ERROR = `UUPDATE_USER_ERROR${postfix}`;

export const updateUserAction: ActionFunctionAny<Action<any>> = createAction(
  UPDATE_USER
);
export const updateUserSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_USER_SUCCESS);
export const updateUserErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UUPDATE_USER_ERROR);

function* updateUserWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateUser, id, fields);
    yield put(updateUserSuccessAction(result));
    yield history.push('/user/list');
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${result.id} ha sido actualizado!`,
      }),
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.users.error_responses.users_unique_username
    )
      ? translations.users.error_responses.users_unique_username_message
      : message;
    yield releaseForm();
    yield put(updateUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateUserWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_USER, updateUserWorker);
}

const usersReducerHandlers = {
  [UPDATE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      user: null,
    };
  },
  [UUPDATE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateUserWatcher);
userReducer.addHandlers(usersReducerHandlers);
