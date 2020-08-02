import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCatalog } from '../../service/catalog.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';

const postfix = '/app';
const LOAD_CATALOG_RESULTS_REPORT_CYTG = `LOAD_CATALOG_RESULTS_REPORT_CYTG${postfix}`;
const LOAD_CATALOG_RESULTS_REPORT_CYTG_SUCCESS = `LOAD_CATALOG_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const LOAD_CATALOG_RESULTS_REPORT_CYTG_ERROR = `LOAD_CATALOG_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const loadCatalogResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_CYTG);
export const loadCatalogResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_CYTG_SUCCESS);
export const loadCatalogResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_RESULTS_REPORT_CYTG_ERROR);

function* loadCatalogsResultsReportCYTGWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    yield put(loadCatalogResultsReportCYTGSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogResultsReportCYTGErrorAction());
    console.log(e);
  }
}

function* loadCatalogResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(
    LOAD_CATALOG_RESULTS_REPORT_CYTG,
    loadCatalogsResultsReportCYTGWorker
  );
}

const resultsReportCYTGReducerHandlers = {
  [LOAD_CATALOG_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_RESULTS_REPORT_CYTG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_RESULTS_REPORT_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
