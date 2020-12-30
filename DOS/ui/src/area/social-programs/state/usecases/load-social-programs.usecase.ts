import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { currentUserDivisionIdSelector } from 'src/area/auth/state/auth.selectors';
import { getSocialPrograms } from '../../service/social-programs.service';
import { socialProgramsReducer } from '../social-programs.reducer';
import { pagingSelector, filterOptionsSelector } from '../social-programs.selectors';

const postfix = '/app';
const LOAD_SOCIAL_PROGRAMS = `LOAD_SOCIAL_PROGRAMS${postfix}`;
const LOAD_SOCIAL_PROGRAMS_SUCCESS = `LOAD_SOCIAL_PROGRAMS_SUCCESS${postfix}`;
const LOAD_SOCIAL_PROGRAMS_ERROR = `LOAD_SOCIAL_PROGRAMS_ERROR${postfix}`;

export const loadSocialProgramsAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_SOCIAL_PROGRAMS);
export const loadSocialProgramsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_SOCIAL_PROGRAMS_SUCCESS);
export const loadSocialProgramsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_SOCIAL_PROGRAMS_ERROR);

function* loadSocialProgramsWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getSocialPrograms, options);
    yield put(
      loadSocialProgramsSuccessAction({
        socialPrograms: result.data,
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
    yield put(loadSocialProgramsErrorAction());
  }
}

function* loadSocialProgramsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_SOCIAL_PROGRAMS, loadSocialProgramsWorker);
}

const socialProgramsReducerHandlers = {
  [LOAD_SOCIAL_PROGRAMS]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_SOCIAL_PROGRAMS_SUCCESS]: (state: any, action: any) => {
    const { socialPrograms, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      socialPrograms,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_SOCIAL_PROGRAMS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadSocialProgramsWatcher);
socialProgramsReducer.addHandlers(socialProgramsReducerHandlers);
