import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getAudits } from '../../service/audits.service';
import { auditsReducer } from '../audits.reducer';
import { pagingSelector } from '../audits.selectors';

const postfix = '/app';
const LOAD_AUDITS = `LOAD_AUDITS${postfix}`;
const LOAD_AUDITS_SUCCESS = `LOAD_AUDITS_SUCCESS${postfix}`;
const LOAD_AUDITS_ERROR = `LOAD_AUDITS_ERROR${postfix}`;

export const loadAuditsAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_AUDITS
);
export const loadAuditsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_AUDITS_SUCCESS);
export const loadAuditsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_AUDITS_ERROR);

function* loadAuditsWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getAudits, options);
    yield put(
      loadAuditsSuccessAction({
        audits: result.data,
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
    yield put(loadAuditsErrorAction());
  }
}

function* loadAuditsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_AUDITS, loadAuditsWorker);
}

const auditsReducerHandlers = {
  [LOAD_AUDITS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_AUDITS_SUCCESS]: (state: any, action: any) => {
    const { audits, paging } = action.payload;
    return {
      ...state,
      loading: false,
      audits,
      paging: {
        ...paging,
      },
    };
  },
  [LOAD_AUDITS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadAuditsWatcher);
auditsReducer.addHandlers(auditsReducerHandlers);
