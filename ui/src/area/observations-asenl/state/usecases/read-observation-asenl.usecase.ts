import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationASENL } from '../../service/observations-asenl.service';
import { observationsASENLReducer } from '../observations-asenl.reducer';

const postfix = '/app';
const READ_OBSERVATION_ASENL = `READ_OBSERVATION_ASENL${postfix}`;
const READ_OBSERVATION_ASENL_SUCCESS = `READ_OBSERVATION_ASENL_SUCCESS${postfix}`;
const READ_OBSERVATION_ASENL_ERROR = `READ_OBSERVATION_ASENL_ERROR${postfix}`;

export const readObservationASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASENL);
export const readObservationASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASENL_SUCCESS);
export const readObservationASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASENL_ERROR);

function* readObservationASENLWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationASENL, id);
    yield put(readObservationASENLSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readObservationASENLErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/observation-asenl/list');
  }
}

function* readObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_OBSERVATION_ASENL, readObservationASENLWorker);
}

const observationsReducerHandlers = {
  [READ_OBSERVATION_ASENL]: (state: any) => {
    return {
      ...state,
      loading: true,
      observation: null,
    };
  },
  [READ_OBSERVATION_ASENL_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      observation: action.payload,
    };
  },
  [READ_OBSERVATION_ASENL_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readObservationWatcher);
observationsASENLReducer.addHandlers(observationsReducerHandlers);
