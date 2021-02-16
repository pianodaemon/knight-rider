import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateAction } from '../../service/actions.service';
import { actionsReducer } from '../actions.reducer';
import { loadActionsAction } from './load-actions.usecase';

const postfix = '/app';
const UPDATE_ACTION = `UPDATE_ACTION${postfix}`;
const UPDATE_ACTION_SUCCESS = `UPDATE_ACTION_SUCCESS${postfix}`;
const UPDATE_ACTION_ERROR = `UPDATE_ACTION_ERROR${postfix}`;

export const updateActionAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_ACTION);
export const updateActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_ACTION_SUCCESS);
export const updateActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_ACTION_ERROR);

function* updateActionWorker(action: any): Generator<any, any, any> {
  try {
    const { title, history, id, org_fiscal_id, description } = action.payload;
    const result = yield call(updateAction, org_fiscal_id, id, title, description);
    yield put(updateActionSuccessAction(result));
    yield history.push('/acciones/list');
    yield put(loadActionsAction());
    yield put(
      notificationAction({
        message: `¡Acción (ASF y ASENL) ${result.id} ha sido actualizada!`,
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield releaseForm();
    yield put(updateActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateActionWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_ACTION, updateActionWorker);
}

const actionReducerHandlers = {
  [UPDATE_ACTION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_ACTION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      action: null,
    };
  },
  [UPDATE_ACTION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateActionWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
