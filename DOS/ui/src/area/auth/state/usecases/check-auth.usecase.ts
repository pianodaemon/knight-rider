import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { put, takeLatest } from 'redux-saga/effects';
import Cookies from 'universal-cookie';
import { mergeSaga } from 'src/redux-utils/merge-saga';
// import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
// import { logoutAction } from './logout.usecase';
import { authReducer } from '../auth.reducer';

const postfix = '/app';
const CHECK_AUTH = `CHECK_AUTH${postfix}`;
const CHECK_AUTH_LOGGED_IN = `CHECK_AUTH_LOGGED_IN${postfix}`;

export const checkAuthAction: ActionFunctionAny<
  Action<any>
> = createAction(CHECK_AUTH);
export const checkAuthLoggedInAction: ActionFunctionAny<
  Action<any>
> = createAction(CHECK_AUTH_LOGGED_IN);

function* checkAuthWorker(action: any): Generator<any, any, any> {
  // const { history } = action.payload;
  try {
    const cookies = new Cookies();
    const token = yield cookies.get('token');
    if (token) {
      yield put(checkAuthLoggedInAction());
    }
    throw new Error('Not Logged In!');
    /*
    yield put(
      notificationAction({
        message: `¡Sesión terminada con éxito!`,
        type: 'success',
      })
    );
    */
  } catch (e) {
    // yield console.log(e);
    // return history.push('/sign-in');
  }
}

function* checkAuthWatcher(): Generator<any, any, any> {
  yield takeLatest(CHECK_AUTH, checkAuthWorker);
}

const authReducerHandlers = {
  [CHECK_AUTH]: (state: any) => {
    return {
      ...state,
      signedIn: false,
      checked: true,
    };
  },
  [CHECK_AUTH_LOGGED_IN]: (state: any) => {
    return {
      ...state,
      signedIn: true,
      checked: true,
    };
  },
};

mergeSaga(checkAuthWatcher);
authReducer.addHandlers(authReducerHandlers);
