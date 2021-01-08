import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateStatus } from '../../service/status.service';
import { statusReducer } from '../status.reducer';
import { loadStatusesAction } from './load-statuses.usecase';

const postfix = '/app';
const UPDATE_STATUS = `UPDATE_STATUS${postfix}`;
const UPDATE_STATUS_SUCCESS = `UPDATE_STATUS_SUCCESS${postfix}`;
const UPDATE_STATUS_ERROR = `UPDATE_STATUS_ERROR${postfix}`;

export const updateStatusAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_STATUS);
export const updateStatusSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_STATUS_SUCCESS);
export const updateStatusErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_STATUS_ERROR);

function* updateStatusWorker(action: any): Generator<any, any, any> {
  try {
    const { title, history, id, org_fiscal_id, pre_ires } = action.payload;
    const result = yield call(updateStatus, org_fiscal_id, pre_ires, id, title);
    yield put(updateStatusSuccessAction(result));
    yield history.push('/estatus/list');
    yield put(loadStatusesAction());
    yield put(
      notificationAction({
        message: `¡Estatus ${result.id} ha sido actualizado!`,
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
    yield put(updateStatusErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateStatusWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_STATUS, updateStatusWorker);
}

const statusReducerHandlers = {
  [UPDATE_STATUS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_STATUS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      status: null,
    };
  },
  [UPDATE_STATUS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateStatusWatcher);
statusReducer.addHandlers(statusReducerHandlers);
