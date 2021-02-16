import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeStatus } from '../../service/status.service';
import { statusReducer } from '../status.reducer';
import { loadStatusesAction } from './load-statuses.usecase';

const postfix = '/app';
const REMOVE_STATUS = `REMOVE_STATUS${postfix}`;
const REMOVE_STATUS_SUCCESS = `REMOVE_STATUS_SUCCESS${postfix}`;
const REMOVE_STATUS_ERROR = `REMOVE_STATUS_ERROR${postfix}`;

export const removeStatusAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_STATUS);
export const removeStatusSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_STATUS_SUCCESS);
export const removeStatusErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_STATUS_ERROR);

function* removeStatusWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, pre_ires, id } =  action.payload;
    const result = yield call(removeStatus, org_fiscal_id, pre_ires, id);
    yield put(removeStatusSuccessAction(result));
    yield put(loadStatusesAction());
    yield put(
      notificationAction({
        message: `¡Estatus ${result.id} ha sido eliminado!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeStatusErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeStatusWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_STATUS, removeStatusWorker);
}

const statusReducerHandlers = {
  [REMOVE_STATUS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_STATUS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_STATUS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeStatusWatcher);
statusReducer.addHandlers(statusReducerHandlers);
