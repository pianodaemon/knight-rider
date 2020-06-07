import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationSFP } from '../../service/observations-asf.service';
import { observationsASFReducer } from '../observations-asf.reducer';

const postfix = '/app';
const READ_OBSERVATION_ASF = `READ_OBSERVATION_ASF${postfix}`;
const READ_OBSERVATION_ASF_SUCCESS = `READ_OBSERVATION_ASF_SUCCESS${postfix}`;
const READ_OBSERVATION_ASF_ERROR = `READ_OBSERVATION_ASF_ERROR${postfix}`;

export const readObservationASFAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASF);
export const readObservationASFSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASF_SUCCESS);
export const readObservationASFErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_OBSERVATION_ASF_ERROR);

function* readObservationASFWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationSFP, id);
    yield put(readObservationASFSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readObservationASFErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/observation-asf/list');
  }
}

function* readObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_OBSERVATION_ASF, readObservationASFWorker);
}

const observationsReducerHandlers = {
  [READ_OBSERVATION_ASF]: (state: any) => {
    return {
      ...state,
      loading: true,
      observation: null,
    };
  },
  [READ_OBSERVATION_ASF_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      observation: action.payload,
    };
  },
  [READ_OBSERVATION_ASF_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readObservationWatcher);
observationsASFReducer.addHandlers(observationsReducerHandlers);
