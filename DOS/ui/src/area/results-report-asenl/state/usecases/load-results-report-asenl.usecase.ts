import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getResultReportsASENL } from '../../service/results-report-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';
import { pagingSelector, filterOptionsSelector } from '../results-report-asenl.selectors';

const postfix = '/app';
const LOAD_RESULTS_REPORT_ASENL = `LOAD_RESULTS_REPORT_ASENL${postfix}`;
const LOAD_RESULTS_REPORT_ASENL_SUCCESS = `LOAD_RESULTS_REPORT_ASENL_SUCCESS${postfix}`;
const LOAD_RESULTS_REPORT_ASENL_ERROR = `LOAD_RESULTS_REPORT_ASENL_ERROR${postfix}`;

export const loadResultsReportASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_ASENL);
export const loadResultsReportASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_ASENL_SUCCESS);
export const loadResultsReportASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_ASENL_ERROR);

function* loadResultsReportASENLWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getResultReportsASENL, options);
    yield put(
      loadResultsReportASENLSuccessAction({
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
    yield put(loadResultsReportASENLErrorAction());
  }
}

function* loadResultsReportASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_RESULTS_REPORT_ASENL, loadResultsReportASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [LOAD_RESULTS_REPORT_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_RESULTS_REPORT_ASENL_SUCCESS]: (state: any, action: any) => {
    const { reports, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      reports,
      paging: {
        ...paging,
      },
      filters
    };
  },
  [LOAD_RESULTS_REPORT_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadResultsReportASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
