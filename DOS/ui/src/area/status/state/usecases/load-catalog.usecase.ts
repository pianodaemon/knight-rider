import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getStatusCatalog } from '../../service/catalog.service';
import { statusReducer } from '../status.reducer';

const postfix = '/app';
const LOAD_CATALOG_STATUS = `LOAD_CATALOG_STATUS${postfix}`;
const LOAD_CATALOG_STATUS_SUCCESS = `LOAD_CATALOG_STATUS_SUCCESS${postfix}`;
const LOAD_CATALOG_STATUS_ERROR = `LOAD_CATALOG_STATUS_ERROR${postfix}`;

export const loadCatalogStatusAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_STATUS
);
export const loadCatalogStatusSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_STATUS_SUCCESS);
export const loadCatalogStatusErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_STATUS_ERROR);

function* loadCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(
      getStatusCatalog, {
        ...(divisionId === 0 ? {} : {direccion_id: divisionId})
      }
    );
    yield put(loadCatalogStatusSuccessAction(result));
  } catch (e) {
    yield put(loadCatalogStatusErrorAction());
    console.log(e);
  }
}

function* loadCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CATALOG_STATUS, loadCatalogsWorker);
}

const actionReducerHandlers = {
  [LOAD_CATALOG_STATUS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_STATUS_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_STATUS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
statusReducer.addHandlers(actionReducerHandlers);
