import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeObservation } from '../../service/observations-sfp.service';
import { observationsSFPReducer } from '../observations-sfp.reducer';
import { loadObservationsAction } from './load-observations-sfp.usecase';

const postfix = '/app';
const REMOVE_OBSERVATION = `REMOVE_OBSERVATION${postfix}`;
const REMOVE_OBSERVATION_SUCCESS = `REMOVE_OBSERVATION_SUCCESS${postfix}`;
const REMOVE_OBSERVATION_ERROR = `REMOVE_OBSERVATION_ERROR${postfix}`;

export const removeObservationAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION);
export const removeObservationActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_SUCCESS);
export const removeObservationActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ERROR);

function* removeObservationWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(removeObservation, action.payload);
    yield put(removeObservationActionSuccessAction(result));
    yield put(loadObservationsAction());
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
    yield put(removeObservationActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_OBSERVATION, removeObservationWorker);
}

const observationsReducerHandlers = {
  [REMOVE_OBSERVATION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_OBSERVATION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_OBSERVATION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeObservationWatcher);
observationsSFPReducer.addHandlers(observationsReducerHandlers);
