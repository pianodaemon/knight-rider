import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateObservationASF } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { loadObservationsASFAction } from './load-observations-asf.usecase';

const postfix = '/app';
const UPDATE_OBSERVATION_ASF = `UPDATE_OBSERVATION_ASF${postfix}`;
const UPDATE_OBSERVATION_ASF_SUCCESS = `UPDATE_OBSERVATION_ASF_SUCCESS${postfix}`;
const UPDATE_OBSERVATION_ASF_ERROR = `UPDATE_OBSERVATION_ASF_ERROR${postfix}`;

export const updateObservationASFAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASF);
export const updateObservationASFSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASF_SUCCESS);
export const updateObservationASFErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASF_ERROR);

function* updateObservationASFWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateObservationASF, id, fields);
    yield put(updateObservationASFSuccessAction(result));
    yield history.push('/observation-asf/list');
    yield put(loadObservationsASFAction());
    yield put(
      notificationAction({
        message: `¡Observación ASF ${result.id} ha sido actualizada!`,
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
    yield put(updateObservationASFErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateObservationASFWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_OBSERVATION_ASF, updateObservationASFWorker);
}

const observationsASFReducerHandlers = {
  [UPDATE_OBSERVATION_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_OBSERVATION_ASF_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [UPDATE_OBSERVATION_ASF_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateObservationASFWatcher);
observationsASFReducer.addHandlers(observationsASFReducerHandlers);
