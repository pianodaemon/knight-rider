import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateDependency } from '../../service/dependencies.service';
import { dependenciesReducer } from '../dependencies.reducer';
import { loadDependenciesAction } from './load-dependencies.usecase';

const postfix = '/app';
const UPDATE_DEPENDENCY = `UPDATE_DEPENDENCY${postfix}`;
const UPDATE_DEPENDENCY_SUCCESS = `UPDATE_DEPENDENCY_SUCCESS${postfix}`;
const UPDATE_DEPENDENCY_ERROR = `UPDATE_DEPENDENCY_ERROR${postfix}`;

export const updateDependencyAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_DEPENDENCY);
export const updateDependencySuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_DEPENDENCY_SUCCESS);
export const updateDependencyErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_DEPENDENCY_ERROR);

function* updateDependencyWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateDependency, id, fields);
    yield put(updateDependencySuccessAction(result));
    yield history.push('/dependency/list');
    yield put(loadDependenciesAction());
    yield put(
      notificationAction({
        message: `¡Dependencia ${result.id} ha sido actualizada!`,
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield releaseForm();
    yield put(updateDependencyErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateDependecyWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_DEPENDENCY, updateDependencyWorker);
}

const dependenciesReducerHandlers = {
  [UPDATE_DEPENDENCY]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_DEPENDENCY_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      dependency: null,
    };
  },
  [UPDATE_DEPENDENCY_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateDependecyWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
