import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getAuditCatalog } from '../../service/catalog.service';
import { auditsReducer } from '../audits.reducer';

const postfix = '/app';
const LOAD_AUDIT_CATALOG = `LOAD_AUDIT_CATALOG${postfix}`;
const LOAD_AUDIT_CATALOG_SUCCESS = `LOAD_AUDIT_CATALOG_SUCCESS${postfix}`;
const LOAD_AUDIT_CATALOG_ERROR = `LOAD_AUDIT_CATALOG_ERROR${postfix}`;

export const loadAuditCatalogAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_AUDIT_CATALOG);
export const loadAuditCatalogSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_AUDIT_CATALOG_SUCCESS);
export const loadAuditCatalogErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_AUDIT_CATALOG_ERROR);

function* loadAuditCatalogsWorker(): Generator<any, any, any> {
  try {
    const divisionId = yield select(currentUserDivisionIdSelector);
    const result = yield call(getAuditCatalog, {
      ...(divisionId === 0 ? {} : {direccion_id: divisionId})
    });
    yield put(loadAuditCatalogSuccessAction(result));
  } catch (e) {
    yield put(loadAuditCatalogErrorAction());
    console.log(e);
  }
}

function* loadAuditCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_AUDIT_CATALOG, loadAuditCatalogsWorker);
}

const auditReducerHandlers = {
  [LOAD_AUDIT_CATALOG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_AUDIT_CATALOG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_AUDIT_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadAuditCatalogWatcher);
auditsReducer.addHandlers(auditReducerHandlers);
