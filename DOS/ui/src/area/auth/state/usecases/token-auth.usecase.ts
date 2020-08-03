import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { login } from '../../service/auth.service';
import { authReducer } from '../auth.reducer';
// import { loadResultsReportCYTGAction } from './load-results-report-cytg.usecase';

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
    yield delay(1000);
    const { credentials, history } = action.payload;
    const result = yield call(login, credentials);
    yield put(authTokenSuccessAction(result));
    yield history.push('/audits/list');
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
    yield put(authTokenErrorAction());
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
      token: null,
    };
  },
  [AUTH_TOKEN_SUCCESS]: (state: any, action: any) => {
    const { token } = action.payload;
    return {
      ...state,
      loading: false,
      token,
    };
  },
  [AUTH_TOKEN_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
    };
  },
};

mergeSaga(authTokenWatcher);
authReducer.addHandlers(authReducerHandlers);
