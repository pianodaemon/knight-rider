import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createObservationASENL } from '../../service/observations-asenl.service';
import { observationsASENLReducer } from '../observations-asenl.reducer';
import { loadObservationsASENLAction } from './load-observations-asenl.usecase';

const postfix = '/app';
const CREATE_OBSERVATION_ASENL = `CREATE_OBSERVATION_ASENL${postfix}`;
const CREATE_OBSERVATION_ASENL_SUCCESS = `CREATE_OBSERVATION_ASENL_SUCCESS${postfix}`;
const CREATE_OBSERVATION_ASENL_ERROR = `CREATE_OBSERVATION_ASENL_ERROR${postfix}`;

export const createObservationASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASENL);
export const createObservationASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASENL_SUCCESS);
export const createObservationASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_OBSERVATION_ASENL_ERROR);

function* createObservationASENLWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createObservationASENL, fields);
    yield put(createObservationASENLSuccessAction(result));
    yield history.push('/observation-asenl/list');
    yield put(loadObservationsASENLAction());
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
    yield put(createObservationASENLErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createObservationASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OBSERVATION_ASENL, createObservationASENLWorker);
}

const observationsASENLReducerHandlers = {
  [CREATE_OBSERVATION_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OBSERVATION_ASENL_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_OBSERVATION_ASENL_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createObservationASENLWatcher);
observationsASENLReducer.addHandlers(observationsASENLReducerHandlers);
