import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { resultsReportReducer } from '../results-report.reducer';

const postfix = '/app';
const LOAD_CATALOG_ASF = `LOAD_CATALOG_ASF${postfix}`;
const LOAD_CATALOG_SUCCESS_ASF = `LOAD_CATALOG_SUCCESS_ASF${postfix}`;
const LOAD_CATALOG_ERROR_ASF = `LOAD_CATALOG_ERROR_ASF${postfix}`;

export const loadCatalogAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_ASF
);
export const loadCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_SUCCESS_ASF);
export const loadCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_ERROR_ASF);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    yield put(loadCatalogSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_ASF, loadCatalogsWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_CATALOG_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_SUCCESS_ASF]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_ERROR_ASF]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
