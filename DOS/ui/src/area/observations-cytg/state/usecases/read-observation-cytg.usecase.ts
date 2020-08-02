import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationCYTG } from '../../service/observations-cytg.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';

const postfix = '/app';
const READ_OBSERVATION_CYTG = `READ_OBSERVATION_CYTG${postfix}`;
const READ_OBSERVATION_CYTG_SUCCESS = `READ_OBSERVATION_CYTG_SUCCESS${postfix}`;
const READ_OBSERVATION_CYTG_ERROR = `READ_OBSERVATION_CYTG_ERROR${postfix}`;

export const readObservationCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_CYTG);
export const readObservationCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_CYTG_SUCCESS);
export const readObservationCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_CYTG_ERROR);

function* readObservationCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationCYTG, id);
    yield put(readObservationCYTGSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readObservationCYTGErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/observation-cytg/list');
  }
}

function* readObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_OBSERVATION_CYTG, readObservationCYTGWorker);
}

const observationsReducerHandlers = {
  [READ_OBSERVATION_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
      observation: null,
    };
  },
  [READ_OBSERVATION_CYTG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      observation: action.payload,
    };
  },
  [READ_OBSERVATION_CYTG_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readObservationWatcher);
observationsCYTGReducer.addHandlers(observationsReducerHandlers);
