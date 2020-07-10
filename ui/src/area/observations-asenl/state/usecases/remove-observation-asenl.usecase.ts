import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteObservationASENL } from '../../service/observations-asenl.service';
import { observationsASENLReducer } from '../observations-asenl.reducer';
import { loadObservationsASENLAction } from './load-observations-asenl.usecase';

const postfix = '/app';
const REMOVE_OBSERVATION_ASENL = `REMOVE_OBSERVATION_ASENL${postfix}`;
const REMOVE_OBSERVATION_ASENL_SUCCESS = `REMOVE_OBSERVATION_ASENL_SUCCESS${postfix}`;
const REMOVE_OBSERVATION_ASENL_ERROR = `REMOVE_OBSERVATION_ASENL_ERROR${postfix}`;

export const removeObservationASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASENL);
export const removeObservationASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASENL_SUCCESS);
export const removeObservationASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_OBSERVATION_ASENL_ERROR);

function* removeObservationASENLWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteObservationASENL, action.payload);
    yield put(removeObservationASENLSuccessAction(result));
    yield put(loadObservationsASENLAction());
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
    yield put(removeObservationASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeObservationASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_OBSERVATION_ASENL, removeObservationASENLWorker);
}

const observationsASENLReducerHandlers = {
  [REMOVE_OBSERVATION_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_OBSERVATION_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_OBSERVATION_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeObservationASENLWatcher);
observationsASENLReducer.addHandlers(observationsASENLReducerHandlers);
