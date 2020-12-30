import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { translations } from 'src/shared/translations/translations.util';
import { createSocialProgram } from '../../service/social-programs.service';
import { socialProgramsReducer } from '../social-programs.reducer';
import { loadSocialProgramsAction } from './load-social-programs.usecase';

const postfix = '/app';
const CREATE_SOCIAL_PROGRAM = `CREATE_SOCIAL_PROGRAM${postfix}`;
const CREATE_SOCIAL_PROGRAM_SUCCESS = `CREATE_SOCIAL_PROGRAM_SUCCESS${postfix}`;
const CREATE_SOCIAL_PROGRAM_ERROR = `CREATE_SOCIAL_PROGRAM_ERROR${postfix}`;

export const createSocialProgramAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_SOCIAL_PROGRAM);
export const createSocialProgramSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_SOCIAL_PROGRAM_SUCCESS);
export const createSocialProgramErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_SOCIAL_PROGRAM_ERROR);

function* createSocialProgramWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createSocialProgram, fields);
    yield put(createSocialProgramSuccessAction(result));
    yield history.push('/social-program/list');
    yield put(loadSocialProgramsAction());
    yield put(
      notificationAction({
        message: `¡Programa Social ${result.id} ha sido creado!`,
        type: 'success',
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
    yield put(createSocialProgramErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createSocialProgramWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_SOCIAL_PROGRAM, createSocialProgramWorker);
}

const socialProgramsReducerHandlers = {
  [CREATE_SOCIAL_PROGRAM]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_SOCIAL_PROGRAM_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      socialProgram: null,
    };
  },
  [CREATE_SOCIAL_PROGRAM_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createSocialProgramWatcher);
socialProgramsReducer.addHandlers(socialProgramsReducerHandlers);
