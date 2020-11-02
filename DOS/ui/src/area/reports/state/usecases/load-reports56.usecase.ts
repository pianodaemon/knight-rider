import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReport56 } from '../../service/reports56.service';
import { result56Reducer } from '../reports56.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';

const postfix = '/app';
const LOAD_REPORT56 = `LOAD_REPORT56${postfix}`;
const LOAD_REPORT56_SUCCESS = `LOAD_REPORT56_SUCCESS${postfix}`;
const LOAD_REPORT56_ERROR = `LOAD_REPORT56_ERROR${postfix}`;

export const loadReport56Action: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT56);
export const loadReport56SuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT56_SUCCESS);
export const loadReport56ActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT56_ERROR);

function* loadReport56Worker(action?: any): Generator<any, any, any> {
  try {
    const { ejercicio_fin, ejercicio_ini, fiscal } = action.payload || {};

    const options = {
      ...action.payload,
      ejercicio_fin: ejercicio_fin,
      ejercicio_ini: ejercicio_ini,
      fiscal       : fiscal,
    };

    if(ejercicio_fin < ejercicio_ini){
      yield put(
        notificationAction({
          message: `La fecha inicial debe ser menor`,
        }),
      );
      return;
    }

    const result = yield call(getReport56, options);

    var sendData = {data_rows: result.data.data_rows};
    yield put(loadReport56SuccessAction( sendData ));
  } catch (e) {
    console.log(e);
    yield put(loadReport56ActionErrorAction());
  }
}

function* loadReport56Watcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORT56, loadReport56Worker);
}

const report56ReducerHandlers = {
  [LOAD_REPORT56]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORT56_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORT56_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadReport56Watcher);
result56Reducer.addHandlers(report56ReducerHandlers);
