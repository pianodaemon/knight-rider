import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createObservationCYTG } from '../../service/observations-cytg.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';
import { loadObservationsCYTGAction } from './load-observations-cytg.usecase';

const postfix = '/app';
const CREATE_OBSERVATION_CYTG = `CREATE_OBSERVATION_CYTG${postfix}`;
const CREATE_OBSERVATION_CYTG_SUCCESS = `CREATE_OBSERVATION_CYTG_SUCCESS${postfix}`;
const CREATE_OBSERVATION_CYTG_ERROR = `CREATE_OBSERVATION_CYTG_ERROR${postfix}`;

export const createObservationCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_CYTG);
export const createObservationCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_CYTG_SUCCESS);
export const createObservationCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_CYTG_ERROR);

function* createObservationCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createObservationCYTG, fields);
    yield put(createObservationCYTGSuccessAction(result));
    yield history.push('/observation-cytg/list');
    yield put(loadObservationsCYTGAction());
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
    yield put(createObservationCYTGErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createObservationCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OBSERVATION_CYTG, createObservationCYTGWorker);
}

const observationsCYTGReducerHandlers = {
  [CREATE_OBSERVATION_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OBSERVATION_CYTG_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_OBSERVATION_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createObservationCYTGWatcher);
observationsCYTGReducer.addHandlers(observationsCYTGReducerHandlers);
