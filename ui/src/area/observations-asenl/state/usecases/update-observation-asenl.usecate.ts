import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateObservationASENL } from '../../service/observations-asenl.service';
import { observationsASENLReducer } from '../observations-asenl.reducer';
import { loadObservationsASENLAction } from './load-observations-asenl.usecase';

const postfix = '/app';
const UPDATE_OBSERVATION_ASENL = `UPDATE_OBSERVATION_ASENL${postfix}`;
const UPDATE_OBSERVATION_ASENL_SUCCESS = `UPDATE_OBSERVATION_ASENL_SUCCESS${postfix}`;
const UPDATE_OBSERVATION_ASENL_ERROR = `UPDATE_OBSERVATION_ASENL_ERROR${postfix}`;

export const updateObservationASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASENL);
export const updateObservationASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASENL_SUCCESS);
export const updateObservationASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_OBSERVATION_ASENL_ERROR);

function* updateObservationASENLWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateObservationASENL, id, fields);
    yield put(updateObservationASENLSuccessAction(result));
    yield history.push('/observation-asenl/list');
    yield put(loadObservationsASENLAction());
    yield put(
      notificationAction({
        message: `¡Observación ASENL ${result.id} ha sido actualizada!`,
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
    yield put(updateObservationASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateObservationASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_OBSERVATION_ASENL, updateObservationASENLWorker);
}

const observationsASENLReducerHandlers = {
  [UPDATE_OBSERVATION_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_OBSERVATION_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [UPDATE_OBSERVATION_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateObservationASENLWatcher);
observationsASENLReducer.addHandlers(observationsASENLReducerHandlers);
