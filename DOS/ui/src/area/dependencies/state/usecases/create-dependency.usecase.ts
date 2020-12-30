import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createDependency } from '../../service/dependencies.service';
import { dependenciesReducer } from '../dependencies.reducer';
import { loadDependenciesAction } from './load-dependencies.usecase';

const postfix = '/app';
const CREATE_DEPENDENCY = `CREATE_DEPENDENCY${postfix}`;
const CREATE_DEPENDENCY_SUCCESS = `CREATE_DEPENDENCY_SUCCESS${postfix}`;
const CREATE_DEPENDENCY_ERROR = `CREATE_DEPENDENCY_ERROR${postfix}`;

export const createDependencyAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_DEPENDENCY);
export const createDependencySuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_DEPENDENCY_SUCCESS);
export const createDependencyErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_DEPENDENCY_ERROR);

function* createDependecyWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createDependency, fields);
    yield put(createDependencySuccessAction(result));
    yield history.push('/dependency/list');
    yield put(loadDependenciesAction());
    yield put(
      notificationAction({
        message: `¡Dependencia ${result.id} ha sido creada!`,
        type: 'success',
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
    yield put(createDependencyErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createDependencyWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_DEPENDENCY, createDependecyWorker);
}

const dependenciesReducerHandlers = {
  [CREATE_DEPENDENCY]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_DEPENDENCY_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      observation: null,
    };
  },
  [CREATE_DEPENDENCY_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createDependencyWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
