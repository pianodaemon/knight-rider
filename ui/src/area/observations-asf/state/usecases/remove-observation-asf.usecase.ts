import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteObservationASF } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { loadObservationsASFAction } from './load-observations-asf.usecase';

const postfix = '/app';
const REMOVE_OBSERVATION_ASF = `REMOVE_OBSERVATION_ASF${postfix}`;
const REMOVE_OBSERVATION_ASF_SUCCESS = `REMOVE_OBSERVATION_ASF_SUCCESS${postfix}`;
const REMOVE_OBSERVATION_ASF_ERROR = `REMOVE_OBSERVATION_ASF_ERROR${postfix}`;

export const removeObservationASFAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASF);
export const removeObservationASFSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASF_SUCCESS);
export const removeObservationASFErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASF_ERROR);

function* removeObservationASFWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteObservationASF, action.payload);
    yield put(removeObservationASFSuccessAction(result));
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
    yield put(removeObservationASFErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeObservationASFWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_OBSERVATION_ASF, removeObservationASFWorker);
}

const observationsASFReducerHandlers = {
  [REMOVE_OBSERVATION_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_OBSERVATION_ASF_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_OBSERVATION_ASF_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeObservationASFWatcher);
observationsASFReducer.addHandlers(observationsASFReducerHandlers);
