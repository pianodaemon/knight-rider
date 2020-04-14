import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { createAudit } from '../../service/audits.service';
import { auditsReducer } from '../audits.reducer';
import { loadAuditCatalogAction } from './load-audit-catalog.usecase';

const postfix = '/app';
const CREATE_AUDIT = `CREATE_AUDIT${postfix}`;
const CREATE_AUDIT_SUCCESS = `CREATE_AUDIT_SUCCESS${postfix}`;
const CREATE_AUDIT_ERROR = `CREATE_AUDIT_ERROR${postfix}`;

export const createAuditAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_AUDIT
);
export const createAuditActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_AUDIT_SUCCESS);
export const createAuditActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_AUDIT_ERROR);

function* createAuditWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createAudit, fields);
    yield put(createAuditActionSuccessAction(result));
    yield history.push('/audit/list');
    yield put(loadAuditCatalogAction());
    yield put(
      notificationAction({
        message: `¡Auditoría ${result.id} ha sido creada!`,
        type: 'success',
      }),
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield releaseForm();
    yield put(createAuditActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createAuditWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_AUDIT, createAuditWorker);
}

const auditsReducerHandlers = {
  [CREATE_AUDIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_AUDIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      audit: null,
    };
  },
  [CREATE_AUDIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createAuditWatcher);
auditsReducer.addHandlers(auditsReducerHandlers);
