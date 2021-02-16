import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readStatus } from '../../service/status.service';
import { statusReducer } from '../status.reducer';

const postfix = '/app';
const READ_STATUS = `READ_STATUS${postfix}`;
const READ_STATUS_SUCCESS = `READ_STATUS_SUCCESS${postfix}`;
const READ_STATUS_ERROR = `READ_STATUS_ERROR${postfix}`;

export const readStatusAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_STATUS);
export const readStatusSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_STATUS_SUCCESS);
export const readStatusErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_STATUS_ERROR);

function* readStatusWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, pre_ires, id } = action.payload;
    const result = yield call(readStatus, org_fiscal_id, pre_ires, id );
    yield put(readStatusSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readStatusErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/estatus/list');
  }
}

function* readStatusWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_STATUS, readStatusWorker);
}

const statusReducerHandlers = {
  [READ_STATUS]: (state: any) => {
    return {
      ...state,
      loading: true,
      status: null,
    };
  },
  [READ_STATUS_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      status: action.payload,
    };
  },
  [READ_STATUS_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readStatusWatcher);
statusReducer.addHandlers(statusReducerHandlers);
