import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
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
  } catch (e) {
    const { releaseForm } = action.payload;
    yield releaseForm();
    yield put(updateObservationActionErrorAction());
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
