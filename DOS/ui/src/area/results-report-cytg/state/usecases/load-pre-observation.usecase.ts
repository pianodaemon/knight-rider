import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readObservationCYTG } from 'src/area/observations-cytg/service/observations-cytg.service';
import { resultsReportCYTGReducer } from '../results-report-cytg.reducer';

const postfix = '/app';
const LOAD_PRE_OBSERVATION_CYTG = `LOAD_PRE_OBSERVATION_CYTG${postfix}`;
const LOAD_PRE_OBSERVATION_CYTG_SUCCESS = `LOAD_PRE_OBSERVATION_CYTG_SUCCESS${postfix}`;
const LOAD_PRE_OBSERVATION_CYTG_ERROR = `LOAD_PRE_OBSERVATION_CYTG_ERROR${postfix}`;

export const loadPreObservationCYTGAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_CYTG);
export const loadPreObservationCYTGSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_CYTG_SUCCESS);
export const loadPreObservationCYTGErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_PRE_OBSERVATION_CYTG_ERROR);

function* loadPreObservationCYTGWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readObservationCYTG, id);
    yield put(loadPreObservationCYTGSuccessAction(result));
  } catch (e) {
    yield put(loadPreObservationCYTGErrorAction(e));
    if (e && e.response && e.response.status) {
      console.log('Error', e.response.status);
    }
  }
}

function* loadPreObservationCYTGWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PRE_OBSERVATION_CYTG, loadPreObservationCYTGWorker);
}

const resultsReportCYTGReducerHandlers = {
  [LOAD_PRE_OBSERVATION_CYTG]: (state: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: true,
      },
    };
  },
  [LOAD_PRE_OBSERVATION_CYTG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      observacion_pre: {
        ...state.observacion_pre,
        loading: false,
        observations: [action.payload],
      },
    };
  },
  [LOAD_PRE_OBSERVATION_CYTG_ERROR]: (state: any, action: any) => {
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

mergeSaga(loadPreObservationCYTGWatcher);
resultsReportCYTGReducer.addHandlers(resultsReportCYTGReducerHandlers);
