import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createAction as createActions } from '../../service/actions.service';
import { actionsReducer } from '../actions.reducer';
import { loadActionsAction } from './load-actions.usecase';

const postfix = '/app';
const CREATE_ACTION = `CREATE_ACTION${postfix}`;
const CREATE_ACTION_SUCCESS = `CREATE_ACTION_SUCCESS${postfix}`;
const CREATE_ACTION_ERROR = `CREATE_ACTION_ERROR${postfix}`;

export const createActionAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_ACTION);
export const createActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_ACTION_SUCCESS);
export const createActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_ACTION_ERROR);

function* createActionWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createActions, fields);
    yield put(createActionSuccessAction(result));
    yield history.push('/acciones/list');
    yield put(loadActionsAction());
    yield put(
      notificationAction({
        message: `¡Acción (ASF y ASENL) ${result.id} ha sido creada!`,
        type: 'success',
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
    yield put(createActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createActionWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_ACTION, createActionWorker);
}

const actionReducerHandlers = {
  [CREATE_ACTION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_ACTION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      action: null,
    };
  },
  [CREATE_ACTION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createActionWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
