import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { loadCatalogAction as loadCatalogObsSFPAction } from 'src/area/observations-sfp/state/usecases/load-catalog.usecase';
import { updateAudit } from '../../service/audits.service';
import { auditsReducer } from '../audits.reducer';
import { loadAuditsAction } from './load-audits.usecase';

const postfix = '/app';
const UPDATE_AUDIT = `UPDATE_AUDIT${postfix}`;
const UPDATE_AUDIT_SUCCESS = `UPDATE_AUDIT_SUCCESS${postfix}`;
const UPDATE_AUDIT_ERROR = `UPDATE_AUDIT_ERROR${postfix}`;

export const updateAuditAction: ActionFunctionAny<Action<any>> = createAction(
  UPDATE_AUDIT
);
export const updateAuditSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_AUDIT_SUCCESS);
export const updateAuditErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_AUDIT_ERROR);

function* updateAuditWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateAudit, id, fields);
    yield put(updateAuditSuccessAction(result));
    yield history.push('/audit/list');
    yield put(loadAuditsAction());
    yield put(loadCatalogObsSFPAction());
    yield put(
      notificationAction({
        message: `¡Auditoría ${result.id} ha sido actualizada!`,
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield releaseForm();
    yield put(updateAuditErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateAuditWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_AUDIT, updateAuditWorker);
}

const auditsReducerHandlers = {
  [UPDATE_AUDIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_AUDIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      audit: null,
    };
  },
  [UPDATE_AUDIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateAuditWatcher);
auditsReducer.addHandlers(auditsReducerHandlers);
