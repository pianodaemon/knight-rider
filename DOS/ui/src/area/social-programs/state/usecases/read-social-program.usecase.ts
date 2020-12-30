import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readSocialProgram } from '../../service/social-programs.service';
import { socialProgramsReducer } from '../social-programs.reducer';

const postfix = '/app';
const READ_SOCIAL_PROGRAM = `READ_SOCIAL_PROGRAM${postfix}`;
const READ_SOCIAL_PROGRAM_SUCCESS = `READ_SOCIAL_PROGRAM_SUCCESS${postfix}`;
const READ_SOCIAL_PROGRAM_ERROR = `READ_SOCIAL_PROGRAM_ERROR${postfix}`;

export const readSocialProgramAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_SOCIAL_PROGRAM);
export const readSocialProgramSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_SOCIAL_PROGRAM_SUCCESS);
export const readSocialProgramErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_SOCIAL_PROGRAM_ERROR);

function* readSocialProgramWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readSocialProgram, id);
    yield put(readSocialProgramSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield put(readSocialProgramErrorAction(e));
    if (e && e.response && e.response.status === 404) {
      yield history.push('/404');
      return;
    }
    yield history.push('/social-program/list');
  }
}

function* readSocialProgramWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_SOCIAL_PROGRAM, readSocialProgramWorker);
}

const socialProgramsReducerHandlers = {
  [READ_SOCIAL_PROGRAM]: (state: any) => {
    return {
      ...state,
      loading: true,
      socialProgram: null,
    };
  },
  [READ_SOCIAL_PROGRAM_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      socialProgram: action.payload,
    };
  },
  [READ_SOCIAL_PROGRAM_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      error: action.payload,
    };
  },
};

mergeSaga(readSocialProgramWatcher);
socialProgramsReducer.addHandlers(socialProgramsReducerHandlers);
