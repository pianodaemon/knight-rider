import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readAction } from '../../service/actions.service';
import { actionsReducer } from '../actions.reducer';

const postfix = '/app';
const READ_ACTION = `READ_ACTION${postfix}`;
const READ_ACTION_SUCCESS = `READ_ACTION_SUCCESS${postfix}`;
const READ_ACTION_ERROR = `READ_ACTION_ERROR${postfix}`;

export const readActionAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_ACTION);
export const readActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_ACTION_SUCCESS);
export const readActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_ACTION_ERROR);

function* readActionWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, id } = action.payload;
    const result = yield call(readAction, org_fiscal_id, id );
    yield put(readActionSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readActionErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/acciones/list');
  }
}

function* readActionWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_ACTION, readActionWorker);
}

const actionReducerHandlers = {
  [READ_ACTION]: (state: any) => {
    return {
      ...state,
      loading: true,
      action: null,
    };
  },
  [READ_ACTION_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      action: action.payload,
    };
  },
  [READ_ACTION_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readActionWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
