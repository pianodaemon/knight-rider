import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeInternalClas } from '../../service/internal-clas.service';
import { internalClasReducer } from '../internal-clas.reducer';
import { loadInternalClasAction } from './load-internal-clas.usecase';

const postfix = '/app';
const REMOVE_INTERNAL_CLAS = `REMOVE_INTERNAL_CLAS${postfix}`;
const REMOVE_INTERNAL_CLAS_SUCCESS = `REMOVE_INTERNAL_CLAS_SUCCESS${postfix}`;
const REMOVE_INTERNAL_CLAS_ERROR = `REMOVE_INTERNAL_CLAS_ERROR${postfix}`;

export const removeInternalClasAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_INTERNAL_CLAS);
export const removeInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_INTERNAL_CLAS_SUCCESS);
export const removeInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_INTERNAL_CLAS_ERROR);

function* removeInternalClasWorker(action: any): Generator<any, any, any> {
  try {
    const { org_fiscal_id, direccion_id, id } =  action.payload;
    const result = yield call(removeInternalClas, org_fiscal_id, direccion_id, id);
    yield put(removeInternalClasSuccessAction(result));
    yield put(loadInternalClasAction());
    yield put(
      notificationAction({
        message: `¡Clasificación Interna de CyTG ${result.sorting_val} ha sido eliminada!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeInternalClasErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeInternalClasWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_INTERNAL_CLAS, removeInternalClasWorker);
}

const internalClasReducerHandlers = {
  [REMOVE_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_INTERNAL_CLAS_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_INTERNAL_CLAS_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeInternalClasWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
