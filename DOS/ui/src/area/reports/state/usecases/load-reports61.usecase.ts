import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReport61 } from '../../service/reports61.service';
import { result61Reducer } from '../reports61.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';

const postfix = '/app';
const LOAD_REPORT61 = `LOAD_REPORT61${postfix}`;
const LOAD_REPORT61_SUCCESS = `LOAD_REPORT61_SUCCESS${postfix}`;
const LOAD_REPORT61_ERROR = `LOAD_REPORT61_ERROR${postfix}`;

export const loadReport61Action: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT61);
export const loadReport61SuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT61_SUCCESS);
export const loadReport61ActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT61_ERROR);

function* loadReport61Worker(action?: any): Generator<any, any, any> {
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

    const result = yield call(getReport61, options);

    var dat = result.data;
    
    var sum_obj = { c_obs:0, monto:0 };
    dat.data_rows.forEach(function(x: any) {
      sum_obj.c_obs      += x.c_obs      ;
      sum_obj.monto      += x.monto      ;
    } )

    var sendData = {data_rows: result.data.data_rows, sum_rows: sum_obj};
    yield put(loadReport61SuccessAction( sendData ));
  } catch (e) {
    console.log(e);
    yield put(loadReport61ActionErrorAction());
  }
}

function* loadReport61Watcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORT61, loadReport61Worker);
}

const report61ReducerHandlers = {
  [LOAD_REPORT61]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORT61_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORT61_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadReport61Watcher);
result61Reducer.addHandlers(report61ReducerHandlers);
