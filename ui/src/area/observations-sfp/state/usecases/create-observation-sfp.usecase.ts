import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createObservationSFP } from '../../service/observations-sfp.service';
import { observationsSFPReducer } from '../observations-sfp.reducer';
import { loadObservationsSFPAction } from './load-observations-sfp.usecase';

const postfix = '/app';
const CREATE_OBSERVATION_SFP = `CREATE_OBSERVATION_SFP${postfix}`;
const CREATE_OBSERVATION_SUCCESS_SFP = `CREATE_OBSERVATION_SUCCESS_SFP${postfix}`;
const CREATE_OBSERVATION_ERROR_SFP = `CREATE_OBSERVATION_ERROR_SFP${postfix}`;

export const createObservationSFPAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_SFP);
export const createObservationSFPSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_SUCCESS_SFP);
export const createObservationSFPErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ERROR_SFP);

function* createObservationSFPWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createObservationSFP, fields);
    yield put(createObservationSFPSuccessAction(result));
    yield history.push('/observation-sfp/list');
    yield put(loadObservationsSFPAction());
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
    yield put(createObservationSFPErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createObservationSFPWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OBSERVATION_SFP, createObservationSFPWorker);
}

const observationsReducerHandlers = {
  [CREATE_OBSERVATION_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OBSERVATION_SUCCESS_SFP]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_OBSERVATION_ERROR_SFP]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createObservationSFPWatcher);
observationsSFPReducer.addHandlers(observationsReducerHandlers);
