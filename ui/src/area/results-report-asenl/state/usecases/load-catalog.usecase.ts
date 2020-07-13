import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';

const postfix = '/app';
const LOAD_CATALOG_RESULTS_REPORT_ASENL = `LOAD_CATALOG_RESULTS_REPORT_ASENL${postfix}`;
const LOAD_CATALOG_RESULTS_REPORT_ASENL_SUCCESS = `LOAD_CATALOG_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const LOAD_CATALOG_RESULTS_REPORT_ASENL_ERROR = `LOAD_CATALOG_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const loadCatalogResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_ASENL);
export const loadCatalogResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_ASENL_SUCCESS);
export const loadCatalogResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_ASENL_ERROR);

function* loadCatalogsResultsReportASENLWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    yield put(loadCatalogResultsReportASENLSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogResultsReportASENLErrorAction());
    console.log(e);
  }
}

function* loadCatalogResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(
    LOAD_CATALOG_RESULTS_REPORT_ASENL,
    loadCatalogsResultsReportASENLWorker
  );
}

const resultsReportASENLReducerHandlers = {
  [LOAD_CATALOG_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_RESULTS_REPORT_ASENL_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_RESULTS_REPORT_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
