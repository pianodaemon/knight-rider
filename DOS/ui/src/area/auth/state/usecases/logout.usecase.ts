import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest, delay } from 'redux-saga/effects';
import Cookies from 'universal-cookie';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { logout } from '../../service/auth.service';
import { authReducer } from '../auth.reducer';

const postfix = '/app';
const LOGOUT = `LOGOUT${postfix}`;
const LOGOUT_SUCCESS = `LOGOUT_SUCCESS${postfix}`;
const LOGOUT_ERROR = `LOGOUT_ERROR${postfix}`;

export const logoutAction: ActionFunctionAny<
  Action<any>
> = createAction(LOGOUT);
export const logoutSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOGOUT_SUCCESS);
export const logoutErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOGOUT_ERROR);

function* logoutWorker(action: any): Generator<any, any, any> {
  try {
    const { history } = action.payload;
    yield call(logout);
    yield removeAuthCookie();
    yield put(logoutSuccessAction());
    yield history.push('/sign-in');
    yield put(
      notificationAction({
        message: `¡Sesión terminada con éxito!`,
        type: 'success',
      })
    );
  } catch (e) {
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield put(logoutErrorAction(e));
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* logoutWatcher(): Generator<any, any, any> {
  yield takeLatest(LOGOUT, logoutWorker);
}

function removeAuthCookie(): void {
  const cookies = new Cookies();
  cookies.remove('token');
}

const authReducerHandlers = {
  [LOGOUT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOGOUT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      token: null,
      signedIn: false,
    };
  },
  [LOGOUT_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      signedIn: false,
    };
  },
};

mergeSaga(logoutWatcher);
authReducer.addHandlers(authReducerHandlers);
