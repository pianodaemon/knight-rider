import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createObservationASF } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';
import { loadObservationsASFAction } from './load-observations-asf.usecase';

const postfix = '/app';
const CREATE_OBSERVATION_ASF = `CREATE_OBSERVATION_ASF${postfix}`;
const CREATE_OBSERVATION_ASF_SUCCESS = `CREATE_OBSERVATION_ASF_SUCCESS${postfix}`;
const CREATE_OBSERVATION_ASF_ERROR = `CREATE_OBSERVATION_ASF_ERROR${postfix}`;

export const createObservationASFAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASF);
export const createObservationASFSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASF_SUCCESS);
export const createObservationASFErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASF_ERROR);

function* createObservationASFWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createObservationASF, fields);
    yield put(createObservationASFSuccessAction(result));
    yield history.push('/observation-asf/list');
    yield put(loadObservationsASFAction());
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
    yield put(createObservationASFErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createObservationASFWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OBSERVATION_ASF, createObservationASFWorker);
}

const observationsASFReducerHandlers = {
  [CREATE_OBSERVATION_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OBSERVATION_ASF_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_OBSERVATION_ASF_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createObservationASFWatcher);
observationsASFReducer.addHandlers(observationsASFReducerHandlers);
