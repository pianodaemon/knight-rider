import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { TokenStorage } from 'src/shared/utils/token-storage.util';
import { authReducer } from '../auth.reducer';
import { loadCatalogAction as loadCatalogObsSFPAction } from 'src/area/observations-sfp/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsASFAction } from 'src/area/observations-asf/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsASENLAction } from 'src/area/observations-asenl/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogObsCYTGAction } from 'src/area/observations-cytg/state/usecases/load-catalog.usecase';
import { loadCatalogAction as loadCatalogResultsReportAction } from 'src/area/results-report/state/usecases/load-catalog.usecase';
import { loadCatalogResultsReportASENLAction } from 'src/area/results-report-asenl/state/usecases/load-catalog.usecase';
import { loadCatalogResultsReportCYTGAction } from 'src/area/results-report-cytg/state/usecases/load-catalog.usecase';
import { loadAuditCatalogAction } from 'src/area/auditories/state/usecases/load-audit-catalog.usecase';
import { loadUsersCatalogAction } from 'src/area/users/state/usecases/load-users-catalog.usecase';

const postfix = '/app';
const CHECK_AUTH = `CHECK_AUTH${postfix}`;
const CHECK_AUTH_LOGGED_IN = `CHECK_AUTH_LOGGED_IN${postfix}`;

export const checkAuthAction: ActionFunctionAny<
  Action<any>
> = createAction(CHECK_AUTH);
export const checkAuthLoggedInAction: ActionFunctionAny<
  Action<any>
> = createAction(CHECK_AUTH_LOGGED_IN);

function* checkAuthWorker(): Generator<any, any, any> {
  try {
    if (TokenStorage.isAuthenticated()) {
      yield put(checkAuthLoggedInAction());
      // Load all Form Catalogs
      yield put(loadCatalogObsSFPAction());
      yield put(loadCatalogObsASFAction());
      yield put(loadAuditCatalogAction());
      yield put(loadUsersCatalogAction());
      yield put(loadCatalogResultsReportAction());
      yield put(loadCatalogObsASENLAction());
      yield put(loadCatalogResultsReportASENLAction());
      yield put(loadCatalogObsCYTGAction());
      yield put(loadCatalogResultsReportCYTGAction());
      return;
    }
    // throw new Error('Not Logged In!');
  } catch (e) {
    yield console.log(e, 'Authentication Error.');
  }
}

function* checkAuthWatcher(): Generator<any, any, any> {
  yield takeLatest(CHECK_AUTH, checkAuthWorker);
}

const authReducerHandlers = {
  [CHECK_AUTH]: (state: any) => {
    return {
      ...state,
      signedIn: false,
      checked: true,
    };
  },
  [CHECK_AUTH_LOGGED_IN]: (state: any) => {
    return {
      ...state,
      claims: TokenStorage.getTokenClaims(),
      signedIn: true,
      checked: true,
    };
  },
};

mergeSaga(checkAuthWatcher);
authReducer.addHandlers(authReducerHandlers);
