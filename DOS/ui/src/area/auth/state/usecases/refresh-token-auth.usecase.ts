import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { refreshToken } from '../../service/auth.service';
import { authReducer } from '../auth.reducer';

const postfix = '/app';
const REFRESH_TOKEN_AUTH = `REFRESH_TOKEN_AUTH${postfix}`;
const REFRESH_TOKEN_AUTH_SUCCESS = `REFRESH_TOKEN_AUTH_SUCCESS${postfix}`;
const REFRESH_TOKEN_AUTH_ERROR = `REFRESH_TOKEN_AUTH_ERROR${postfix}`;

export const refreshTokenAuthAction: ActionFunctionAny<
  Action<any>
> = createAction(REFRESH_TOKEN_AUTH);
export const refreshTokenAuthSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REFRESH_TOKEN_AUTH_SUCCESS);
export const refreshTokenAuthErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REFRESH_TOKEN_AUTH_ERROR);

function* refreshTokenAuthWorker(action: any): Generator<any, any, any> {
  try {
    const { credentials, history } = action.payload;
    const result = yield call(refreshToken, '');
    const { token } = result.data;
    yield setAuthCookie(token);
    yield put(refreshTokenAuthSuccessAction(token));
    yield history.push('/audit/list');
    yield put(
      notificationAction({
        message: `¡Bienvenido!`,
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
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield releaseForm();
    yield put(refreshTokenAuthErrorAction(e));
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* refreshTokenAuthWatcher(): Generator<any, any, any> {
  yield takeLatest(REFRESH_TOKEN_AUTH, refreshTokenAuthWorker);
}

function setAuthCookie(token: string): void {
  const cookies = new Cookies();
  const jwt: any = jwt_decode(token);
  cookies.set(
    'token',
    token,
    { 
      path: '/',
      expires: new Date(jwt.exp * 1000)
    }
  );
}

const authReducerHandlers = {
  [REFRESH_TOKEN_AUTH]: (state: any) => {
    return {
      ...state,
      loading: true,
      // token: null,
      signedIn: false,
    };
  },
  [REFRESH_TOKEN_AUTH_SUCCESS]: (state: any, action: any) => {
    // const { token } = action.payload;
    return {
      ...state,
      loading: false,
      signedIn: true,
    };
  },
  [REFRESH_TOKEN_AUTH_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      signedIn: false,
    };
  },
};

mergeSaga(refreshTokenAuthWatcher);
authReducer.addHandlers(authReducerHandlers);
