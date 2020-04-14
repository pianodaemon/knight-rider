import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readAudit } from '../../service/audits.service';
import { auditsReducer } from '../audits.reducer';

const postfix = '/app';
const READ_AUDIT = `READ_AUDIT${postfix}`;
const READ_AUDIT_SUCCESS = `READ_AUDIT_SUCCESS${postfix}`;
const READ_AUDIT_ERROR = `READ_AUDIT_ERROR${postfix}`;

export const readAuditAction: ActionFunctionAny<Action<any>> = createAction(
  READ_AUDIT
);
export const readAuditSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_AUDIT_SUCCESS);
export const readAuditErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_AUDIT_ERROR);

function* readAuditWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readAudit, id);
    yield put(readAuditSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/audit/list');
    yield put(readAuditErrorAction());
  }
}

function* readAuditWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_AUDIT, readAuditWorker);
}

const auditsReducerHandlers = {
  [READ_AUDIT]: (state: any) => {
    return {
      ...state,
      loading: true,
      audit: null,
    };
  },
  [READ_AUDIT_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      audit: action.payload,
    };
  },
  [READ_AUDIT_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readAuditWatcher);
auditsReducer.addHandlers(auditsReducerHandlers);
