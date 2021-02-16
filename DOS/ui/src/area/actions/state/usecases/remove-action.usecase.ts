import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeAction } from '../../service/actions.service';
import { actionsReducer } from '../actions.reducer';
import { loadActionsAction } from './load-actions.usecase';

const postfix = '/app';
const REMOVE_ACTION = `REMOVE_ACTION${postfix}`;
const REMOVE_ACTION_SUCCESS = `REMOVE_ACTION_SUCCESS${postfix}`;
const REMOVE_ACTION_ERROR = `REMOVE_ACTION_ERROR${postfix}`;

export const removeActionAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_ACTION);
export const removeActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_ACTION_SUCCESS);
export const removeActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_ACTION_ERROR);

function* removeActionWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, id } =  action.payload;
    const result = yield call(removeAction, org_fiscal_id, id);
    yield put(removeActionSuccessAction(result));
    yield put(loadActionsAction());
    yield put(
      notificationAction({
        message: `¡Acción (ASF y ASENL) ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeActionWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_ACTION, removeActionWorker);
}

const actionReducerHandlers = {
  [REMOVE_ACTION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_ACTION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_ACTION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeActionWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
