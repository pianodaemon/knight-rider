import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createInternalClas } from '../../service/internal-clas.service';
import { internalClasReducer } from '../internal-clas.reducer';
import { loadInternalClasAction } from './load-internal-clas.usecase';

const postfix = '/app';
const CREATE_INTERNAL_CLAS = `CREATE_INTERNAL_CLAS${postfix}`;
const CREATE_INTERNAL_CLAS_SUCCESS = `CREATE_INTERNAL_CLAS_SUCCESS${postfix}`;
const CREATE_INTERNAL_CLAS_ERROR = `CREATE_INTERNAL_CLAS_ERROR${postfix}`;

export const createInternalClasAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INTERNAL_CLAS);
export const createInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INTERNAL_CLAS_SUCCESS);
export const createInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INTERNAL_CLAS_ERROR);

function* reateInternalClasWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createInternalClas, fields);
    yield put(createInternalClasSuccessAction(result));
    yield history.push('/internal-clas/list');
    yield put(loadInternalClasAction());
    yield put(
      notificationAction({
        message: `¡Clasificación Interna de CyTG ${result.sorting_val} ha sido creada!`,
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
    yield put(createInternalClasErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createInternalClasWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_INTERNAL_CLAS, reateInternalClasWorker);
}

const internalClasReducerHandlers = {
  [CREATE_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_INTERNAL_CLAS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      internalClas: null,
    };
  },
  [CREATE_INTERNAL_CLAS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createInternalClasWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
