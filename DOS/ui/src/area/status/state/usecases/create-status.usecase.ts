import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createStatus } from '../../service/status.service';
import { statusReducer } from '../status.reducer';
import { loadStatusesAction } from './load-statuses.usecase';

const postfix = '/app';
const CREATE_STATUS = `CREATE_STATUS${postfix}`;
const CREATE_STATUS_SUCCESS = `CREATE_STATUS_SUCCESS${postfix}`;
const CREATE_STATUS_ERROR = `CREATE_STATUS_ERROR${postfix}`;

export const createStatusAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_STATUS);
export const createStatusSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_STATUS_SUCCESS);
export const createStatusErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_STATUS_ERROR);

function* createStatusWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createStatus, fields);
    yield put(createStatusSuccessAction(result));
    yield history.push('/estatus/list');
    yield put(loadStatusesAction());
    yield put(
      notificationAction({
        message: `¡Estatus ${result.id} ha sido creado!`,
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
    yield put(createStatusErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createStatusWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_STATUS, createStatusWorker);
}

const statusReducerHandlers = {
  [CREATE_STATUS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_STATUS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      status: null,
    };
  },
  [CREATE_STATUS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createStatusWatcher);
statusReducer.addHandlers(statusReducerHandlers);
