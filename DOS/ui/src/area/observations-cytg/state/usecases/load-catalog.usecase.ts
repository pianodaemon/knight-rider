import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getCatalog } from '../../service/catalog.service';
import { observationsCYTGReducer } from '../observations-cytg.reducer';

const postfix = '/app';
const LOAD_CATALOG_CYTG = `LOAD_CATALOG_CYTG${postfix}`;
const LOAD_CATALOG_CYTG_SUCCESS = `LOAD_CATALOG_CYTG_SUCCESS${postfix}`;
const LOAD_CATALOG_CYTG_ERROR = `LOAD_CATALOG_CYTG_ERROR${postfix}`;

export const loadCatalogAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_CYTG
);
export const loadCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_CYTG_SUCCESS);
export const loadCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_CYTG_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(
      getCatalog, {
        ...(divisionId === 0 ? {} : {direccion_id: divisionId})
      }
    );
    yield put(loadCatalogSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_CYTG, loadCatalogsWorker);
}

const observationsReducerHandlers = {
  [LOAD_CATALOG_CYTG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_CYTG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_CYTG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
observationsCYTGReducer.addHandlers(observationsReducerHandlers);
