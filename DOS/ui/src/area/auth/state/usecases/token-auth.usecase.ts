import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { checkAuthAction } from './check-auth.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { TokenStorage } from 'src/shared/utils/token-storage.util';
import { login } from '../../service/auth.service';
import { authReducer } from '../auth.reducer';

const postfix = '/app';
const AUTH_TOKEN = `AUTH_TOKEN${postfix}`;
const AUTH_TOKEN_SUCCESS = `AUTH_TOKEN_SUCCESS${postfix}`;
const AUTH_TOKEN_ERROR = `AUTH_TOKEN_ERROR${postfix}`;

export const authTokenAction: ActionFunctionAny<
  Action<any>
> = createAction(AUTH_TOKEN);
export const authTokenSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(AUTH_TOKEN_SUCCESS);
export const authTokenErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(AUTH_TOKEN_ERROR);

function* authTokenWorker(action: any): Generator<any, any, any> {
  try {
    const { credentials } = action.payload;
    const result = yield call(login, credentials);
    const { token } = result.data;
    yield TokenStorage.storeToken(token);
    yield put(authTokenSuccessAction(token));
    yield put(checkAuthAction());
    yield put(
      notificationAction({
        message: `¡Bienvenido!`,
        type: 'success',
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let code: string =
      e.response && e.response.data && e.response.data.errors.length
        ? e.response.data.errors[0].code
        : "UNEXPECTED";
    let message = Object.keys(translations.auth.login.errorCodes).includes(code)
      ? translations.auth.login.errorCodes[code]
      : translations.auth.login.errorCodes.UNEXPECTED;
    yield releaseForm();
    yield put(authTokenErrorAction(e));
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* authTokenWatcher(): Generator<any, any, any> {
  yield takeLatest(AUTH_TOKEN, authTokenWorker);
}

const authReducerHandlers = {
  [AUTH_TOKEN]: (state: any) => {
    return {
      ...state,
      loading: true,
      signedIn: false,
    };
  },
  [AUTH_TOKEN_SUCCESS]: (state: any, action: any) => {
    // const { token } = action.payload;
    return {
      ...state,
      claims: TokenStorage.getTokenClaims(),
      loading: false,
      signedIn: true,
    };
  },
  [AUTH_TOKEN_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      signedIn: false,
    };
  },
};

mergeSaga(authTokenWatcher);
authReducer.addHandlers(authReducerHandlers);
