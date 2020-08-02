import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateObservationCYTG } from '../../service/observations-cytg.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';
import { loadObservationsCYTGAction } from './load-observations-cytg.usecase';

const postfix = '/app';
const UPDATE_OBSERVATION_CYTG = `UPDATE_OBSERVATION_CYTG${postfix}`;
const UPDATE_OBSERVATION_CYTG_SUCCESS = `UPDATE_OBSERVATION_CYTG_SUCCESS${postfix}`;
const UPDATE_OBSERVATION_CYTG_ERROR = `UPDATE_OBSERVATION_CYTG_ERROR${postfix}`;

export const updateObservationCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_CYTG);
export const updateObservationCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_CYTG_SUCCESS);
export const updateObservationCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_CYTG_ERROR);

function* updateObservationCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateObservationCYTG, id, fields);
    yield put(updateObservationCYTGSuccessAction(result));
    yield history.push('/observation-cytg/list');
    yield put(loadObservationsCYTGAction());
    yield put(
      notificationAction({
        message: `¡Observación CYTG ${result.id} ha sido actualizada!`,
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
    yield put(updateObservationCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateObservationCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_OBSERVATION_CYTG, updateObservationCYTGWorker);
}

const observationsCYTGReducerHandlers = {
  [UPDATE_OBSERVATION_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_OBSERVATION_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [UPDATE_OBSERVATION_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateObservationCYTGWatcher);
observationsCYTGReducer.addHandlers(observationsCYTGReducerHandlers);
