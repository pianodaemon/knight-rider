import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readUser } from 'src/area/users/service/user.service';
import { TokenStorage } from 'src/shared/utils/token-storage.util';
import { authReducer } from '../auth.reducer';

const postfix = '/app';
const LOAD_USER_PROFILE = `LOAD_USER_PROFILE${postfix}`;
const LOAD_USER_PROFILE_SUCCESS = `LOAD_USER_PROFILE_SUCCESS${postfix}`;
const LOAD_USER_PROFILE_ERROR = `LOAD_USER_PROFILE_ERROR${postfix}`;

export const loadUserProfileAction: ActionFunctionAny<Action<any>> = createAction(
    LOAD_USER_PROFILE
);
export const loadUserProfileSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USER_PROFILE_SUCCESS);
export const loadUserProfileErrorAction: ActionFunctionAny<Action<any>> = createAction(
    LOAD_USER_PROFILE_ERROR
);

function* readUserWorker(action: any): Generator<any, any, any> {
  try {
    const { sub: userId } = TokenStorage.getTokenClaims() || {};
    const result = yield call(readUser, userId);
    yield put(loadUserProfileSuccessAction(result));
  } catch (e) {
    yield put(loadUserProfileErrorAction());
  }
}

function* readUserWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USER_PROFILE, readUserWorker);
}

const authReducerHandlers = {
  [LOAD_USER_PROFILE]: (state: any) => {
    return {
      ...state,
      loading: true,
      profile: null,
    };
  },
  [LOAD_USER_PROFILE_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      profile: action.payload,
    };
  },
  [LOAD_USER_PROFILE_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readUserWatcher);
authReducer.addHandlers(authReducerHandlers);
