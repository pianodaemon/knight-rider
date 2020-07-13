import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationASENL } from 'src/area/observations-asenl/service/observations-asenl.service';
import { resultsReportASENLReducer } from '../results-report-asenl.reducer';

const postfix = '/app';
const LOAD_PRE_OBSERVATION_ASENL = `LOAD_PRE_OBSERVATION_ASENL${postfix}`;
const LOAD_PRE_OBSERVATION_ASENL_SUCCESS = `LOAD_PRE_OBSERVATION_ASENL_SUCCESS${postfix}`;
const LOAD_PRE_OBSERVATION_ASENL_ERROR = `LOAD_PRE_OBSERVATION_ASENL_ERROR${postfix}`;

export const loadPreObservationASENLAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_ASENL);
export const loadPreObservationASENLSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_ASENL_SUCCESS);
export const loadPreObservationASENLErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_ASENL_ERROR);

function* loadPreObservationASENLWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationASENL, id);
    yield put(loadPreObservationASENLSuccessAction(result));
  } catch (e) {
    yield put(loadPreObservationASENLErrorAction(e));
    if (e && e.response && e.response.status) {
      console.log('Error', e.response.status);
    }
  }
}

function* loadPreObservationASENLWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PRE_OBSERVATION_ASENL, loadPreObservationASENLWorker);
}

const resultsReportASENLReducerHandlers = {
  [LOAD_PRE_OBSERVATION_ASENL]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: true,
      },
    };
  },
  [LOAD_PRE_OBSERVATION_ASENL_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        observations: [action.payload],
      },
    };
  },
  [LOAD_PRE_OBSERVATION_ASENL_ERROR]: (state: any, action: any) => {
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

mergeSaga(loadPreObservationASENLWatcher);
resultsReportASENLReducer.addHandlers(resultsReportASENLReducerHandlers);
