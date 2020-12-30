import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getDependencies } from '../../service/dependencies.service';
import { dependenciesReducer } from '../dependencies.reducer';
import { pagingSelector, filterOptionsSelector } from '../dependencies.selectors';

const postfix = '/app';
const LOAD_DEPENDENCIES = `LOAD_DEPENDENCIES${postfix}`;
const LOAD_DEPENDENCIES_SUCCESS = `LOAD_DEPENDENCIES_SUCCESS${postfix}`;
const LOAD_DEPENDENCIES_ERROR = `LOAD_DEPENDENCIES_ERROR${postfix}`;

export const loadDependenciesAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_DEPENDENCIES);
export const loadDependenciesSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_DEPENDENCIES_SUCCESS);
export const loadDependenciesErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_DEPENDENCIES_ERROR);

function* loadDependenciesWorker(action?: any): Generator<any, any, any> {
  try {
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const divisionId = yield select(currentUserDivisionIdSelector);
    const f = yield select(filterOptionsSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      ...(divisionId === 0 ? {} : {direccion_id: divisionId}),
      ...(filters ? filters : f),
    };
    const result = yield call(getDependencies, options);
    yield put(
      loadDependenciesSuccessAction({
        dependencies: result.data,
        paging: {
          count: parseInt(result.headers['x-soa-total-items'], 10) || 0,
          pages: parseInt(result.headers['x-soa-total-pages'], 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        filters: {
          ...(filters ? filters: f)
        }
      })
    );
  } catch (e) {
    yield put(loadDependenciesErrorAction());
  }
}

function* loadDependenciesWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_DEPENDENCIES, loadDependenciesWorker);
}

const dependenciesReducerHandlers = {
  [LOAD_DEPENDENCIES]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_DEPENDENCIES_SUCCESS]: (state: any, action: any) => {
    const { dependencies, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      dependencies,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_DEPENDENCIES_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadDependenciesWatcher);
dependenciesReducer.addHandlers(dependenciesReducerHandlers);
