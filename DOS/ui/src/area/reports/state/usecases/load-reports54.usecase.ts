import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, /*select, */ takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getReport54 } from '../../service/reports54.service';
import { result54Reducer } from '../reports54.reducer';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';

const postfix = '/app';
const LOAD_REPORT54 = `LOAD_REPORT54${postfix}`;
const LOAD_REPORT54_SUCCESS = `LOAD_REPORT54_SUCCESS${postfix}`;
const LOAD_REPORT54_ERROR = `LOAD_REPORT54_ERROR${postfix}`;

export const loadReport54Action: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT54);
export const loadReport54SuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT54_SUCCESS);
export const loadReport54ActionErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_REPORT54_ERROR);

function* loadReport54Worker(action?: any): Generator<any, any, any> {
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

    const result = yield call(getReport54, options);

    var dat = result.data;
    
    var sum_obj = {c_sol:0, m_sol:0, c_analisis:0, m_analisis:0, c_no_sol:0, m_no_sol:0 };
    dat.data_rows.forEach(function(x: any) {
      sum_obj.c_sol      += x.c_sol      ;
      sum_obj.m_sol      += x.m_sol      ;
      sum_obj.c_analisis += x.c_analisis ;
      sum_obj.m_analisis += x.m_analisis ;
      sum_obj.c_no_sol   += x.c_no_sol   ;
      sum_obj.m_no_sol   += x.m_no_sol   ;
    } )

    var sendData = {data_rows: result.data.data_rows, sum_rows: sum_obj};
    yield put(loadReport54SuccessAction( sendData ));
  } catch (e) {
    console.log(e);
    yield put(loadReport54ActionErrorAction());
  }
}

function* loadReport54Watcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_REPORT54, loadReport54Worker);
}

const report54ReducerHandlers = {
  [LOAD_REPORT54]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_REPORT54_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      report: action.payload,
    };
  },
  [LOAD_REPORT54_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadReport54Watcher);
result54Reducer.addHandlers(report54ReducerHandlers);
