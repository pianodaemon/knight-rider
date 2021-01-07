import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getActionsCatalog } from '../../service/catalog.service';
import { actionsReducer } from '../actions.reducer';

const postfix = '/app';
const LOAD_CATALOG_ACTION = `LOAD_CATALOG_ACTION${postfix}`;
const LOAD_CATALOG_ACTION_SUCCESS = `LOAD_CATALOG_ACTION_SUCCESS${postfix}`;
const LOAD_CATALOG_ACTION_ERROR = `LOAD_CATALOG_ACTION_ERROR${postfix}`;

export const loadCatalogActionAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_ACTION
);
export const loadCatalogActionSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_ACTION_SUCCESS);
export const loadCatalogActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_ACTION_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(
      getActionsCatalog, {
        ...(divisionId === 0 ? {} : {direccion_id: divisionId})
      }
    );
    yield put(loadCatalogActionSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogActionErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_ACTION, loadCatalogsWorker);
}

const actionReducerHandlers = {
  [LOAD_CATALOG_ACTION]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_ACTION_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_ACTION_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
actionsReducer.addHandlers(actionReducerHandlers);
