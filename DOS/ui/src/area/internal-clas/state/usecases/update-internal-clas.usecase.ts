import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateInternalClas } from '../../service/internal-clas.service';
import { internalClasReducer } from '../internal-clas.reducer';
import { loadInternalClasAction } from './load-internal-clas.usecase';

const postfix = '/app';
const UPDATE_INTERNAL_CLAS = `UPDATE_INTERNAL_CLAS${postfix}`;
const UPDATE_INTERNAL_CLAS_SUCCESS = `UPDATE_INTERNAL_CLAS_SUCCESS${postfix}`;
const UPDATE_INTERNAL_CLAS_ERROR = `UPDATE_INTERNAL_CLAS_ERROR${postfix}`;

export const updateInternalClasAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_INTERNAL_CLAS);
export const updateInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_INTERNAL_CLAS_SUCCESS);
export const updateInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_INTERNAL_CLAS_ERROR);

function* updateInternalClasWorker(action: any): Generator<any, any, any> {
  try {
    const { title, history, id, org_fiscal_id, direccion_id } = action.payload;
    const result = yield call(updateInternalClas, org_fiscal_id, direccion_id, id, title);
    yield put(updateInternalClasSuccessAction(result));
    yield history.push('/internal-clas/list');
    yield put(loadInternalClasAction());
    yield put(
      notificationAction({
        message: `¡Clasificación Interna de CyTG ${result.sorting_val} ha sido actualizada!`,
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
    yield put(updateInternalClasErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateInternalClasWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_INTERNAL_CLAS, updateInternalClasWorker);
}

const internalClasReducerHandlers = {
  [UPDATE_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_INTERNAL_CLAS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      internalClas: null,
    };
  },
  [UPDATE_INTERNAL_CLAS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateInternalClasWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
