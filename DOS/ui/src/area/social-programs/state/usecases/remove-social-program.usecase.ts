import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { removeSocialProgram } from '../../service/social-programs.service';
import { socialProgramsReducer } from '../social-programs.reducer';
import { loadSocialProgramsAction } from './load-social-programs.usecase';

const postfix = '/app';
const REMOVE_SOCIAL_PROGRAM = `REMOVE_SOCIAL_PROGRAM${postfix}`;
const REMOVE_SOCIAL_PROGRAM_SUCCESS = `REMOVE_SOCIAL_PROGRAM_SUCCESS${postfix}`;
const REMOVE_SOCIAL_PROGRAM_ERROR = `REMOVE_SOCIAL_PROGRAM_ERROR${postfix}`;

export const removeSocialProgramAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_SOCIAL_PROGRAM);
export const removeSocialProgramSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_SOCIAL_PROGRAM_SUCCESS);
export const removeSocialProgramErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(REMOVE_SOCIAL_PROGRAM_ERROR);

function* removeSocialProgramWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(removeSocialProgram, action.payload);
    yield put(removeSocialProgramSuccessAction(result));
    yield put(loadSocialProgramsAction());
    yield put(
      notificationAction({
        message: `¡Programa Social ${result.id} ha sido eliminado!`,
      })
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(removeSocialProgramErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* removeSocialProgramWatcher(): Generator<any, any, any> {
  yield takeLatest(REMOVE_SOCIAL_PROGRAM, removeSocialProgramWorker);
}

const socialProgramsReducerHandlers = {
  [REMOVE_SOCIAL_PROGRAM]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [REMOVE_SOCIAL_PROGRAM_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [REMOVE_SOCIAL_PROGRAM_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(removeSocialProgramWatcher);
socialProgramsReducer.addHandlers(socialProgramsReducerHandlers);
