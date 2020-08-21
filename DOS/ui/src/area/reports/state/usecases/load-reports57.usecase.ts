import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReport57 } from '../../service/reports57.service';
import { result57Reducer } from '../reports57.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';

const postfix = '/app';
const LOAD_REPORT57 = `LOAD_REPORT57${postfix}`;
const LOAD_REPORT57_SUCCESS = `LOAD_REPORT57_SUCCESS${postfix}`;
const LOAD_REPORT57_ERROR = `LOAD_REPORT57_ERROR${postfix}`;

export const loadReport57Action: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT57);
export const loadReport57SuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT57_SUCCESS);
export const loadReport57ActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT57_ERROR);

function* loadReport57Worker(action?: any): Generator<any, any, any> {
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

    const result = yield call(getReport57, options);

    var dat = result.data;
    
    var sum_obj = { c_obs:0, monto:0 };
    dat.data_rows.forEach(function(x: any) {
      sum_obj.c_obs      += x.c_obs      ;
      sum_obj.monto      += x.monto      ;
    } )

    var sendData = {data_rows: result.data.data_rows, sum_rows: sum_obj};
    yield put(loadReport57SuccessAction( sendData ));
  } catch (e) {
    console.log(e);
    yield put(loadReport57ActionErrorAction());
  }
}

function* loadReport57Watcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORT57, loadReport57Worker);
}

const report57ReducerHandlers = {
  [LOAD_REPORT57]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORT57_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORT57_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadReport57Watcher);
result57Reducer.addHandlers(report57ReducerHandlers);
