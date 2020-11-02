import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReport55 } from '../../service/reports55.service';
import { result55Reducer } from '../reports55.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';

const postfix = '/app';
const LOAD_REPORT55 = `LOAD_REPORT55${postfix}`;
const LOAD_REPORT55_SUCCESS = `LOAD_REPORT55_SUCCESS${postfix}`;
const LOAD_REPORT55_ERROR = `LOAD_REPORT55_ERROR${postfix}`;

export const loadReport55Action: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT55);
export const loadReport55SuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT55_SUCCESS);
export const loadReport55ActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT55_ERROR);

function* loadReport55Worker(action?: any): Generator<any, any, any> {
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

    const result = yield call(getReport55, options);

    var sendData = {data_rows: result.data.data_rows };
    yield put(loadReport55SuccessAction( sendData ));
  } catch (e) {
    console.log(e);
    yield put(loadReport55ActionErrorAction());
  }
}

function* loadReport55Watcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORT55, loadReport55Worker);
}

const report55ReducerHandlers = {
  [LOAD_REPORT55]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORT55_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORT55_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadReport55Watcher);
result55Reducer.addHandlers(report55ReducerHandlers);
