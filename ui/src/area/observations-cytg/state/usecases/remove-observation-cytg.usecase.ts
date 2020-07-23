import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteObservationCYTG } from '../../service/observations-cytg.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';
import { loadObservationsCYTGAction } from './load-observations-cytg.usecase';

const postfix = '/app';
const REMOVE_OBSERVATION_CYTG = `REMOVE_OBSERVATION_CYTG${postfix}`;
const REMOVE_OBSERVATION_CYTG_SUCCESS = `REMOVE_OBSERVATION_CYTG_SUCCESS${postfix}`;
const REMOVE_OBSERVATION_CYTG_ERROR = `REMOVE_OBSERVATION_CYTG_ERROR${postfix}`;

export const removeObservationCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_CYTG);
export const removeObservationCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_CYTG_SUCCESS);
export const removeObservationCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_CYTG_ERROR);

function* removeObservationCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteObservationCYTG, action.payload);
    yield put(removeObservationCYTGSuccessAction(result));
    yield put(loadObservationsCYTGAction());
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
    yield put(removeObservationCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeObservationCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_OBSERVATION_CYTG, removeObservationCYTGWorker);
}

const observationsCYTGReducerHandlers = {
  [REMOVE_OBSERVATION_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_OBSERVATION_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_OBSERVATION_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeObservationCYTGWatcher);
observationsCYTGReducer.addHandlers(observationsCYTGReducerHandlers);
