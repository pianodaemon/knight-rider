import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateObservation } from '../../service/observations.service';
import { observationsReducer } from '../observations.reducer';
import { loadObservationsAction } from './load-observations.usecase';

const postfix = '/app';
const UPDATE_OBSERVATION = `UPDATE_OBSERVATION${postfix}`;
const UPDATE_OBSERVATION_SUCCESS = `UPDATE_OBSERVATION_SUCCESS${postfix}`;
const UPDATE_OBSERVATION_ERROR = `UPDATE_OBSERVATION_ERROR${postfix}`;

export const updateObservationAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION);
export const updateObservationActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_SUCCESS);
export const updateObservationActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ERROR);

function* updateObservationWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateObservation, id, fields);
    yield put(updateObservationActionSuccessAction(result));
    yield history.push('/observation/list');
    yield put(loadObservationsAction());
    yield put(
      notificationAction({
        message: `¡Observación ${result.id} ha sido actualizada!`,
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
    yield put(updateObservationActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_OBSERVATION, updateObservationWorker);
}

const observationsReducerHandlers = {
  [UPDATE_OBSERVATION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_OBSERVATION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [UPDATE_OBSERVATION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateObservationWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
