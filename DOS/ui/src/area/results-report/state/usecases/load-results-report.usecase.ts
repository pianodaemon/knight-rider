import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getResultReports } from '../../service/results-report.service';
import { resultsReportReducer } from '../results-report.reducer';
import { pagingSelector } from '../results-report.selectors';

const postfix = '/app';
const LOAD_RESULTS_REPORT = `LOAD_RESULTS_REPORT${postfix}`;
const LOAD_RESULTS_REPORT_SUCCESS = `LOAD_RESULTS_REPORT_SUCCESS${postfix}`;
const LOAD_RESULTS_REPORT_ERROR = `LOAD_RESULTS_REPORT_ERROR${postfix}`;

export const loadResultsReportAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT);
export const loadResultsReportSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_SUCCESS);
export const loadResultsReportErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_RESULTS_REPORT_ERROR);

function* loadResultsReportWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
    };
    const result = yield call(getResultReports, options);
    yield put(
      loadResultsReportSuccessAction({
        reports: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
      })
    );
  } catch (e) {
    yield put(loadResultsReportErrorAction());
  }
}

function* loadResultsReportWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_RESULTS_REPORT, loadResultsReportWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_RESULTS_REPORT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_RESULTS_REPORT_SUCCESS]: (state: any, action: any) => {
    const { reports, paging } = action.payload;
    return {
      ...state,
      loading: false,
      reports,
      paging: {
        ...paging,
      },
    };
  },
  [LOAD_RESULTS_REPORT_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadResultsReportWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
