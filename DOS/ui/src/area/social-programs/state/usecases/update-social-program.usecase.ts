import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { updateSocialProgram } from '../../service/social-programs.service';
import { socialProgramsReducer } from '../social-programs.reducer';
import { loadSocialProgramsAction } from './load-social-programs.usecase';

const postfix = '/app';
const UPDATE_SOCIAL_PROGRAM = `UPDATE_SOCIAL_PROGRAM${postfix}`;
const UPDATE_SOCIAL_PROGRAM_SUCCESS = `UPDATE_SOCIAL_PROGRAM_SUCCESS${postfix}`;
const UPDATE_SOCIAL_PROGRAM_ERROR = `UPDATE_SOCIAL_PROGRAM_ERROR${postfix}`;

export const updateSocialProgramAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_SOCIAL_PROGRAM);
export const updateSocialProgramSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_SOCIAL_PROGRAM_SUCCESS);
export const updateSocialProgramErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_SOCIAL_PROGRAM_ERROR);

function* updateSocialProgramWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateSocialProgram, id, fields);
    yield put(updateSocialProgramSuccessAction(result));
    yield history.push('/social-program/list');
    yield put(loadSocialProgramsAction());
    yield put(
      notificationAction({
        message: `¡Programa Social ${result.id} ha sido actualizado!`,
      })
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    message = message.includes(
      translations.observation.error_responses.unique_constraint
    )
      ? translations.observation.error_responses.unique_error
      : message;
    yield releaseForm();
    yield put(updateSocialProgramErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateSocialProgramWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_SOCIAL_PROGRAM, updateSocialProgramWorker);
}

const socialProgramsReducerHandlers = {
  [UPDATE_SOCIAL_PROGRAM]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_SOCIAL_PROGRAM_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      socialProgram: null,
    };
  },
  [UPDATE_SOCIAL_PROGRAM_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateSocialProgramWatcher);
socialProgramsReducer.addHandlers(socialProgramsReducerHandlers);
