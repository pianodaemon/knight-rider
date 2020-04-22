import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createUser } from '../../service/user.service';
import { userReducer } from '../users.reducer';
import { loadUsersAction } from './load-users.usecase';

const postfix = '/app';
const CREATE_USER = `CREATE_USER${postfix}`;
const CREATE_USER_SUCCESS = `CREATE_USER_SUCCESS${postfix}`;
const CREATE_USER_ERROR = `CREATE_USER_ERROR${postfix}`;

export const createUserAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_USER
);
export const createUserSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_USER_SUCCESS);
export const createUserErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_USER_ERROR);

function* createUserWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createUser, fields);
    yield put(createUserSuccessAction(result));
    yield history.push('/user/list');
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${result.id} ha sido creado!`,
        type: 'success',
      })
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
    yield put(createUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createUserWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_USER, createUserWorker);
}

const userReducerHandlers = {
  [CREATE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      user: null,
    };
  },
  [CREATE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createUserWatcher);
userReducer.addHandlers(userReducerHandlers);
