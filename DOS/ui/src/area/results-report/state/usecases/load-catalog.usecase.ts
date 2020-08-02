import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { resultsReportReducer } from '../results-report.reducer';

const postfix = '/app';
const LOAD_CATALOG_RR = `LOAD_CATALOG_RR${postfix}`;
const LOAD_CATALOG_RR_SUCCESS = `LOAD_CATALOG_RR_SUCCESS${postfix}`;
const LOAD_CATALOG_RR_ERROR = `LOAD_CATALOG_RR_ERROR${postfix}`;

export const loadCatalogAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_RR
);
export const loadCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RR_SUCCESS);
export const loadCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RR_ERROR);

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
  yield takeLatest(LOAD_CATALOG_RR, loadCatalogsWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_CATALOG_RR]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_RR_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_RR_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
