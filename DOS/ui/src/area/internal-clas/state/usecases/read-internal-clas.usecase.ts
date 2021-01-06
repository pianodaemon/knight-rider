import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readInternalClas } from '../../service/internal-clas.service';
import { internalClasReducer } from '../internal-clas.reducer';

const postfix = '/app';
const READ_INTERNAL_CLAS = `READ_INTERNAL_CLAS${postfix}`;
const READ_INTERNAL_CLAS_SUCCESS = `READ_INTERNAL_CLAS_SUCCESS${postfix}`;
const READ_INTERNAL_CLAS_ERROR = `READ_INTERNAL_CLAS_ERROR${postfix}`;

export const readInternalClasAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_INTERNAL_CLAS);
export const readInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_INTERNAL_CLAS_SUCCESS);
export const readInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_INTERNAL_CLAS_ERROR);

function* readInternalClasWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, direccion_id, id } = action.payload;
    const result = yield call(readInternalClas, org_fiscal_id, direccion_id, id );
    yield put(readInternalClasSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readInternalClasErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/internal-clas/list');
  }
}

function* readInternalClasWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_INTERNAL_CLAS, readInternalClasWorker);
}

const internalClasReducerHandlers = {
  [READ_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
      internalClas: null,
    };
  },
  [READ_INTERNAL_CLAS_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      internalClas: action.payload,
    };
  },
  [READ_INTERNAL_CLAS_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readInternalClasWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
