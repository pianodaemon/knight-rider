import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getCatalog } from '../../service/catalog.service';
import { observationsSFPReducer } from '../observations-sfp.reducer';

const postfix = '/app';
const LOAD_CATALOG_SFP = `LOAD_CATALOG_SFP${postfix}`;
const LOAD_CATALOG_SUCCESS_SFP = `LOAD_CATALOG_SUCCESS_SFP${postfix}`;
const LOAD_CATALOG_ERROR_SFP = `LOAD_CATALOG_ERROR_SFP${postfix}`;

export const loadCatalogAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CATALOG_SFP
);
export const loadCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_SUCCESS_SFP);
export const loadCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CATALOG_ERROR_SFP);

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
  yield takeLatest(LOAD_CATALOG_SFP, loadCatalogsWorker);
}

const observationsReducerHandlers = {
  [LOAD_CATALOG_SFP]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_CATALOG_SUCCESS_SFP]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_CATALOG_ERROR_SFP]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCatalogWatcher);
observationsSFPReducer.addHandlers(observationsReducerHandlers);
