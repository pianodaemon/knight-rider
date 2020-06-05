import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateObservationSFP } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { loadObservationsASFAction } from './load-observations-asf.usecase';

const postfix = '/app';
const UPDATE_OBSERVATION_SFP = `UPDATE_OBSERVATION_SFP${postfix}`;
const UPDATE_OBSERVATION_SUCCESS_SFP = `UPDATE_OBSERVATION_SUCCESS_SFP${postfix}`;
const UPDATE_OBSERVATION_ERROR_SFP = `UPDATE_OBSERVATION_ERROR_SFP${postfix}`;

export const updateObservationSFPAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_SFP);
export const updateObservationSFPSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_SUCCESS_SFP);
export const updateObservationSFPErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ERROR_SFP);

function* updateObservationSFPWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateObservationSFP, id, fields);
    yield put(updateObservationSFPSuccessAction(result));
    yield history.push('/observation-sfp/list');
    yield put(loadObservationsASFAction());
    yield put(
      notificationAction({
        message: `¡Observación SFP ${result.id} ha sido actualizada!`,
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
    yield put(updateObservationSFPErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateObservationSFPWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_OBSERVATION_SFP, updateObservationSFPWorker);
}

const observationsSFPReducerHandlers = {
  [UPDATE_OBSERVATION_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_OBSERVATION_SUCCESS_SFP]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [UPDATE_OBSERVATION_ERROR_SFP]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateObservationSFPWatcher);
observationsASFReducer.addHandlers(observationsSFPReducerHandlers);
