import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { observationsReducer } from '../observations.reducer';

const postfix = '/app';
const LOAD_CATALOG = `LOAD_CATALOGS${postfix}`;
const LOAD_CATALOG_SUCCESS = `LOAD_CATALOGS_SUCCESS${postfix}`;
const LOAD_CATALOG_ERROR = `LOAD_CATALOGS_ERROR${postfix}`;

export const loadCatalogAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG
);
export const loadCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_SUCCESS);
export const loadCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    yield put(loadCatalogSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogErrorAction());
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG, loadCatalogsWorker);
}

const observationsReducerHandlers = {
  [LOAD_CATALOG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
