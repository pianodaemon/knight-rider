import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getInternalClasCatalog } from '../../service/catalog.service';
import { internalClasReducer } from '../internal-clas.reducer';

const postfix = '/app';
const LOAD_CATALOG_INTERNAL_CLAS = `LOAD_CATALOG_INTERNAL_CLAS${postfix}`;
const LOAD_CATALOG_INTERNAL_CLAS_SUCCESS = `LOAD_CATALOG_INTERNAL_CLAS_SUCCESS${postfix}`;
const LOAD_CATALOG_INTERNAL_CLAS_ERROR = `LOAD_CATALOG_INTERNAL_CLAS_ERROR${postfix}`;

export const loadCatalogInternalClasAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_INTERNAL_CLAS
);
export const loadCatalogInternalClasSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_INTERNAL_CLAS_SUCCESS);
export const loadCatalogInternalClasErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_INTERNAL_CLAS_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(
      getInternalClasCatalog, {
        ...(divisionId === 0 ? {} : {direccion_id: divisionId})
      }
    );
    yield put(loadCatalogInternalClasSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogInternalClasErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_INTERNAL_CLAS, loadCatalogsWorker);
}

const internalClasReducerHandlers = {
  [LOAD_CATALOG_INTERNAL_CLAS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_INTERNAL_CLAS_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_INTERNAL_CLAS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
internalClasReducer.addHandlers(internalClasReducerHandlers);
