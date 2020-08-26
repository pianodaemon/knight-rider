import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { refreshToken } from '../../service/auth.service';
import { authReducer } from '../auth.reducer';
import { TokenStorage } from 'src/shared/utils/token-storage.util';

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

function* refreshTokenAuthWorker(): Generator<any, any, any> {
  try {
    const { sub: userId } = TokenStorage.getTokenClaims() || {};
    const result = yield call(refreshToken, userId);
    const { token } = result.data;
    TokenStorage.storeToken(token);
    yield put(refreshTokenAuthSuccessAction(token));
    yield put(
      notificationAction({
        message: `¡Su sesión ha sido renovada!`,
        type: 'success',
      })
    );
  } catch (e) {
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error al renovar su sesión! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
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

const authReducerHandlers = {
  [REFRESH_TOKEN_AUTH]: (state: any) => {
    return {
      ...state,
      loading: true,
      refreshing: true,
    };
  },
  [REFRESH_TOKEN_AUTH_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      signedIn: true,
      refreshing: false,
    };
  },
  [REFRESH_TOKEN_AUTH_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      signedIn: false,
      refreshing: false
    };
  },
};

mergeSaga(refreshTokenAuthWatcher);
authReducer.addHandlers(authReducerHandlers);
