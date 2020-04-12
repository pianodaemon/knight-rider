import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservation } from '../../service/observations.service';
import { observationsReducer } from '../observations.reducer';

const postfix = '/app';
const READ_OBSERVATION = `READ_OBSERVATION${postfix}`;
const READ_OBSERVATION_SUCCESS = `READ_OBSERVATION_SUCCESS${postfix}`;
const READ_OBSERVATION_ERROR = `READ_OBSERVATION_ERROR${postfix}`;

export const readObservationAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION);
export const readObservationSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_SUCCESS);
export const readObservationErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ERROR);

function* readObservationWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservation, id);
    yield put(readObservationSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/observation/list');
    yield put(readObservationErrorAction());
  }
}

function* readObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_OBSERVATION, readObservationWorker);
}

const observationsReducerHandlers = {
  [READ_OBSERVATION]: (state: any) => {
    return {
      ...state,
      loading: true,
      observation: null,
    };
  },
  [READ_OBSERVATION_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      observation: action.payload,
    };
  },
  [READ_OBSERVATION_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readObservationWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
