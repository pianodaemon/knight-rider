import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readDependency } from '../../service/dependencies.service';
import { dependenciesReducer } from '../dependencies.reducer';

const postfix = '/app';
const READ_DEPENDENCY = `READ_DEPENDENCY${postfix}`;
const READ_DEPENDENCY_SUCCESS = `READ_DEPENDENCY_SUCCESS${postfix}`;
const READ_DEPENDENCY_ERROR = `READ_DEPENDENCY_ERROR${postfix}`;

export const readDependencyAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_DEPENDENCY);
export const readDependencySuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_DEPENDENCY_SUCCESS);
export const readDependencyErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_DEPENDENCY_ERROR);

function* readDependencyWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readDependency, id);
    yield put(readDependencySuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readDependencyErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/dependency/list');
  }
}

function* readDependencyWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_DEPENDENCY, readDependencyWorker);
}

const dependenciesReducerHandlers = {
  [READ_DEPENDENCY]: (state: any) => {
    return {
      ...state,
      loading: true,
      dependency: null,
    };
  },
  [READ_DEPENDENCY_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      dependency: action.payload,
    };
  },
  [READ_DEPENDENCY_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readDependencyWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
