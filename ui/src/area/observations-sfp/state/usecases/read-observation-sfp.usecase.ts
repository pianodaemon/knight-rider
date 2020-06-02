import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationSFP } from '../../service/observations-sfp.service';
import { observationsSFPReducer } from '../observations-sfp.reducer';

const postfix = '/app';
const READ_OBSERVATION_SFP = `READ_OBSERVATION_SFP${postfix}`;
const READ_OBSERVATION_SFP_SUCCESS = `READ_OBSERVATION_SFP_SUCCESS${postfix}`;
const READ_OBSERVATION_SFP_ERROR = `READ_OBSERVATION_SFP_ERROR${postfix}`;

export const readObservationSFPAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_SFP);
export const readObservationSFPSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_SFP_SUCCESS);
export const readObservationSFPErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_SFP_ERROR);

function* readObservationSFPWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationSFP, id);
    yield put(readObservationSFPSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readObservationSFPErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/observation-sfp/list');
  }
}

function* readObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_OBSERVATION_SFP, readObservationSFPWorker);
}

const observationsReducerHandlers = {
  [READ_OBSERVATION_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
      observation: null,
    };
  },
  [READ_OBSERVATION_SFP_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      observation: action.payload,
    };
  },
  [READ_OBSERVATION_SFP_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readObservationWatcher);
observationsSFPReducer.addHandlers(observationsReducerHandlers);
