import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createObservation } from '../../service/observations.service';
import { observationsReducer } from '../observations.reducer';
import { loadObservationsAction } from './load-observations.usecase';

const postfix = '/app';
const CREATE_OBSERVATION = `CREATE_OBSERVATION${postfix}`;
const CREATE_OBSERVATION_SUCCESS = `CREATE_OBSERVATION_SUCCESS${postfix}`;
const CREATE_OBSERVATION_ERROR = `CREATE_OBSERVATION_ERROR${postfix}`;

export const createObservationAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION);
export const createObservationActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_SUCCESS);
export const createObservationActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ERROR);

function* createObservationWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createObservation, fields);
    yield put(createObservationActionSuccessAction(result));
    yield history.push('/observation/list');
    yield put(loadObservationsAction());
    yield put(
      notificationAction({
        message: `¡Observación ${result.id} ha sido creada!`,
        type: 'success',
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
    yield put(createObservationActionErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OBSERVATION, createObservationWorker);
}

const observationsReducerHandlers = {
  [CREATE_OBSERVATION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OBSERVATION_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_OBSERVATION_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createObservationWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
