import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationASF } from 'src/area/observations-asf/service/observations-asf.service';
import { resultsReportReducer } from '../results-report.reducer';

const postfix = '/app';
const LOAD_PRE_OBSERVATION = `LOAD_PRE_OBSERVATION${postfix}`;
const LOAD_PRE_OBSERVATION_SUCCESS = `LOAD_PRE_OBSERVATION_SUCCESS${postfix}`;
const LOAD_PRE_OBSERVATION_ERROR = `LOAD_PRE_OBSERVATION_ERROR${postfix}`;

export const loadPreObservationAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION);
export const loadPreObservationSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_SUCCESS);
export const loadPreObservationErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_ERROR);

function* loadPreObservationWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationASF, id);
    yield put(loadPreObservationSuccessAction(result));
  } catch (e) {
    yield put(loadPreObservationErrorAction(e));
    if (e && e.response && e.response.status) {
      console.log('Error', e.response.status);
    }
  }
}

function* loadPreObservationWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PRE_OBSERVATION, loadPreObservationWorker);
}

const resultsReportReducerHandlers = {
  [LOAD_PRE_OBSERVATION]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: true,
      },
    };
  },
  [LOAD_PRE_OBSERVATION_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        observations: [action.payload],
      },
    };
  },
  [LOAD_PRE_OBSERVATION_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        error: action.payload,
      },
    };
  },
};

mergeSaga(loadPreObservationWatcher);
resultsReportReducer.addHandlers(resultsReportReducerHandlers);
