import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeDependency } from '../../service/dependencies.service';
import { dependenciesReducer } from '../dependencies.reducer';
import { loadDependenciesAction } from './load-dependencies.usecase';

const postfix = '/app';
const REMOVE_DEPENDENCY = `REMOVE_DEPENDENCY${postfix}`;
const REMOVE_DEPENDENCY_SUCCESS = `REMOVE_DEPENDENCY_SUCCESS${postfix}`;
const REMOVE_DEPENDENCY_ERROR = `REMOVE_DEPENDENCY_ERROR${postfix}`;

export const removeDependencyAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_DEPENDENCY);
export const removeDependencySuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_DEPENDENCY_SUCCESS);
export const removeDependencyErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_DEPENDENCY_ERROR);

function* removeDependencyWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(removeDependency, action.payload);
    yield put(removeDependencySuccessAction(result));
    yield put(loadDependenciesAction());
    yield put(
      notificationAction({
        message: `¡Dependencia ${result.id} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeDependencyErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeDependencyWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_DEPENDENCY, removeDependencyWorker);
}

const dependenciesReducerHandlers = {
  [REMOVE_DEPENDENCY]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_DEPENDENCY_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_DEPENDENCY_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeDependencyWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
