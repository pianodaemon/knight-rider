import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeAudit } from '../../service/audits.service';
import { auditsReducer } from '../audits.reducer';
import { loadAuditsAction } from './load-audits.usecase';

const postfix = '/app';
const REMOVE_AUDIT = `REMOVE_AUDIT${postfix}`;
const REMOVE_AUDIT_SUCCESS = `REMOVE_AUDIT_SUCCESS${postfix}`;
const REMOVE_AUDIT_ERROR = `REMOVE_AUDIT_ERROR${postfix}`;

export const removeAuditAction: ActionFunctionAny<Action<any>> = createAction(
  REMOVE_AUDIT
);
export const removeAuditSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_AUDIT_SUCCESS);
export const removeAuditErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_AUDIT_ERROR);

function* removeAuditWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(removeAudit, action.payload);
    yield put(removeAuditSuccessAction(result));
    yield put(loadAuditsAction());
    yield put(
      notificationAction({
        message: `¡Auditoría ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeAuditErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeAuditWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_AUDIT, removeAuditWorker);
}

const auditReducerHandlers = {
  [REMOVE_AUDIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_AUDIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_AUDIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeAuditWatcher);
auditsReducer.addHandlers(auditReducerHandlers);
