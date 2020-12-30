import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getDependencyCatalog } from '../../service/catalog.service';
import { dependenciesReducer } from '../dependencies.reducer';

const postfix = '/app';
const LOAD_CATALOG_DEPENDENCIES = `LOAD_CATALOG_DEPENDENCIES${postfix}`;
const LOAD_CATALOG_DEPENDENCIES_SUCCESS = `LOAD_CATALOG_DEPENDENCIES_SUCCESS${postfix}`;
const LOAD_CATALOG_DEPENDENCIES_ERROR = `LOAD_CATALOG_DEPENDENCIES_ERROR${postfix}`;

export const loadCatalogDependenciesAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_DEPENDENCIES
);
export const loadCatalogDependenciesSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_DEPENDENCIES_SUCCESS);
export const loadCatalogDependenciesErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_DEPENDENCIES_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(
      getDependencyCatalog, {
        ...(divisionId === 0 ? {} : {direccion_id: divisionId})
      }
    );
    yield put(loadCatalogDependenciesSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogDependenciesErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_DEPENDENCIES, loadCatalogsWorker);
}

const dependenciesReducerHandlers = {
  [LOAD_CATALOG_DEPENDENCIES]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_DEPENDENCIES_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_DEPENDENCIES_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
