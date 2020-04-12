import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getObservations } from '../../service/observations.service';
import { observationsReducer } from '../observations.reducer';

const postfix = '/app';
const LOAD_OBSERVATIONS = `LOAD_OBSERVATIONS${postfix}`;
const LOAD_OBSERVATIONS_SUCCESS = `LOAD_OBSERVATIONS_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_ERROR = `LOAD_OBSERVATIONS_ERROR${postfix}`;

export const loadObservationsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS);
export const loadObservationsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_SUCCESS);
export const loadObservationsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_ERROR);

function* loadObservationsWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getObservations);
    yield put(
      loadObservationsSuccessAction({
        observations: result.data,
        paging: {
          count: result.headers['x-soa-total-items'] || 0,
          pages: result.headers['x-soa-total-pages'] || 0,
        },
      }),
    );
  } catch (e) {
    yield put(loadObservationsErrorAction());
  }
}

function* loadObservationsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS, loadObservationsWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_SUCCESS]: (state: any, action: any) => {
    const { observations, paging } = action.payload;
    return {
      ...state,
      loading: false,
      observations,
      paging,
    };
  },
  [LOAD_OBSERVATIONS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsWatcher);
observationsReducer.addHandlers(observationsReducerHandlers);
