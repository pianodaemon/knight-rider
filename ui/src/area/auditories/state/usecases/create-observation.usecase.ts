import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
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
    yield history.push('/list');
    yield put(loadObservationsAction());
  } catch (e) {
    const { releaseForm } = action.payload;
    yield releaseForm();
    yield put(createObservationActionErrorAction());
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
