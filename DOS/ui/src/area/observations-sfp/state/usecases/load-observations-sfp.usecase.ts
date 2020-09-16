import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getObservations } from '../../service/observations-sfp.service';
import { observationsSFPReducer } from '../observations-sfp.reducer';
import { pagingSelector } from '../observations-sfp.selectors';

const postfix = '/app';
const LOAD_OBSERVATIONS_SFP = `LOAD_OBSLOAD_OBSERVATIONS_SFPERVATIONS${postfix}`;
const LOAD_OBSERVATIONS_SFP_SUCCESS = `LOAD_OBSERVATIONS_SFP_SUCCESS${postfix}`;
const LOAD_OBSERVATIONS_SFP_ERROR = `LOAD_OBSERVATIONS_SFP_ERROR${postfix}`;

export const loadObservationsSFPAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_SFP);
export const loadObservationsSFPSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_SFP_SUCCESS);
export const loadObservationsSFPErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_OBSERVATIONS_SFP_ERROR);

function* loadObservationsSFPWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by } = action.payload || {};
    const paging = yield select(pagingSelector);
    const divisionId = yield select(currentUserDivisionIdSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(divisionId === 0 ? {} : {direccion_id: divisionId})
    };
    const result = yield call(getObservations, options);
    yield put(
      loadObservationsSFPSuccessAction({
        observations: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
      })
    );
  } catch (e) {
    yield put(loadObservationsSFPErrorAction());
  }
}

function* loadObservationsSFPWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_OBSERVATIONS_SFP, loadObservationsSFPWorker);
}

const observationsReducerHandlers = {
  [LOAD_OBSERVATIONS_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_OBSERVATIONS_SFP_SUCCESS]: (state: any, action: any) => {
    const { observations, paging } = action.payload;
    return {
      ...state,
      loading: false,
      observations,
      paging: {
        ...paging,
      },
    };
  },
  [LOAD_OBSERVATIONS_SFP_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadObservationsSFPWatcher);
observationsSFPReducer.addHandlers(observationsReducerHandlers);
