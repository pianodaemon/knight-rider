import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { userReducer } from '../users.reducer';

const postfix = '/app';
const LOAD_USERS_CATALOG = `LOAD_USERS_CATALOG${postfix}`;
const LOAD_USERS_CATALOG_SUCCESS = `LOAD_USERS_CATALOG_SUCCESS${postfix}`;
const LOAD_USERS_CATALOG_ERROR = `LOAD_USERS_CATALOG_ERROR${postfix}`;

export const loadUsersCatalogAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_CATALOG);
export const loadUsersCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_CATALOG_SUCCESS);
export const loadUsersCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_CATALOG_ERROR);

function* loadUsersCatalogWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    yield put(loadUsersCatalogSuccessAction(result));
  } catch (e) {
    yield put(loadUsersCatalogErrorAction());
    console.log(e);
  }
}

function* loadUsersCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USERS_CATALOG, loadUsersCatalogWorker);
}

const usersReducerHandlers = {
  [LOAD_USERS_CATALOG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_USERS_CATALOG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_USERS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUsersCatalogWatcher);
userReducer.addHandlers(usersReducerHandlers);
