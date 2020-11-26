import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getResultReportsCYTG } from '../../service/results-report-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';
import { pagingSelector, filterOptionsSelector } from '../results-report-cytg.selectors';

const postfix = '/app';
const LOAD_RESULTS_REPORT_CYTG = `LOAD_RESULTS_REPORT_CYTG${postfix}`;
const LOAD_RESULTS_REPORT_CYTG_SUCCESS = `LOAD_RESULTS_REPORT_CYTG_SUCCESS${postfix}`;
const LOAD_RESULTS_REPORT_CYTG_ERROR = `LOAD_RESULTS_REPORT_CYTG_ERROR${postfix}`;

export const loadResultsReportCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_CYTG);
export const loadResultsReportCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_CYTG_SUCCESS);
export const loadResultsReportCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_CYTG_ERROR);

function* loadResultsReportCYTGWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const f = yield select(filterOptionsSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(filters ? filters : f),
    };
    const result = yield call(getResultReportsCYTG, options);
    yield put(
      loadResultsReportCYTGSuccessAction({
        reports: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        filters: {
          ...(filters ? filters: f)
        }
      })
    );
  } catch (e) {
    yield put(loadResultsReportCYTGErrorAction());
  }
}

function* loadResultsReportCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_RESULTS_REPORT_CYTG, loadResultsReportCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [LOAD_RESULTS_REPORT_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_RESULTS_REPORT_CYTG_SUCCESS]: (state: any, action: any) => {
    const { reports, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      reports,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_RESULTS_REPORT_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadResultsReportCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
