import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteObservationSFP } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { loadObservationsASFAction } from './load-observations-asf.usecase';

const postfix = '/app';
const REMOVE_OBSERVATION_SFP = `REMOVE_OBSERVATION_SFP${postfix}`;
const REMOVE_OBSERVATION_SUCCESS_SFP = `REMOVE_OBSERVATION_SUCCESS_SFP${postfix}`;
const REMOVE_OBSERVATION_ERROR_SFP = `REMOVE_OBSERVATION_ERROR_SFP${postfix}`;

export const removeObservationSFPAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_SFP);
export const removeObservationSFPSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_SUCCESS_SFP);
export const removeObservationSFPErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ERROR_SFP);

function* removeObservationSFPWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteObservationSFP, action.payload);
    yield put(removeObservationSFPSuccessAction(result));
    yield put(loadObservationsASFAction());
    yield put(
      notificationAction({
        message: `¡Observación ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeObservationSFPErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeObservationSFPWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_OBSERVATION_SFP, removeObservationSFPWorker);
}

const observationsSFPReducerHandlers = {
  [REMOVE_OBSERVATION_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_OBSERVATION_SUCCESS_SFP]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_OBSERVATION_ERROR_SFP]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeObservationSFPWatcher);
observationsASFReducer.addHandlers(observationsSFPReducerHandlers);
