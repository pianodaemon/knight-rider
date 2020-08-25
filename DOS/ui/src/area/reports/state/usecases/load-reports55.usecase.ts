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

    var dat = result.data;
    var sum_obj =  {
        c_asf :     0,
        m_asf :     0,
        c_na_asf :  0,
        m_na_asf :  0,
        c_a_asf :   0,
        m_a_asf :   0,
        c_asenl :   0,
        m_asenl :   0,
        c_na_asenl: 0,
        m_na_asenl: 0,
        c_a_asenl : 0,
        m_a_asenl : 0,
        c_cytg :    0,
        m_cytg :    0,
        c_na_cytg : 0,
        m_na_cytg : 0,
        c_a_cytg :  0,
        m_a_cytg :  0,
        c_na_total: 0,
        m_na_total: 0,
        c_a_total : 0,
        m_a_total : 0,
    }
    
    dat.data_rows.forEach(function(x: any) {
      sum_obj.c_asf       += x.c_asf      ;
      sum_obj.m_asf       += x.m_asf      ;
      sum_obj.c_na_asf    += x.c_na_asf   ;
      sum_obj.m_na_asf    += x.m_na_asf   ;
      sum_obj.c_a_asf     += x.c_a_asf    ;
      sum_obj.m_a_asf     += x.m_a_asf    ;
      sum_obj.c_asenl     += x.c_asenl    ;
      sum_obj.m_asenl     += x.m_asenl    ;
      sum_obj.c_na_asenl  += x.c_na_asenl ;
      sum_obj.m_na_asenl  += x.m_na_asenl ;
      sum_obj.c_a_asenl   += x.c_a_asenl  ;
      sum_obj.m_a_asenl   += x.m_a_asenl  ;
      sum_obj.c_cytg      += x.c_cytg     ;
      sum_obj.m_cytg      += x.m_cytg     ;
      sum_obj.c_na_cytg   += x.c_na_cytg  ;
      sum_obj.m_na_cytg   += x.m_na_cytg  ;
      sum_obj.c_a_cytg    += x.c_a_cytg   ;
      sum_obj.m_a_cytg    += x.m_a_cytg   ;
      sum_obj.c_na_total  += x.c_na_total ;
      sum_obj.m_na_total  += x.m_na_total ;
      sum_obj.c_a_total   += x.c_a_total  ;
      sum_obj.m_a_total   += x.m_a_total  ;
    } )

    var sendData = {data_rows: result.data.data_rows, sum_rows: sum_obj };
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
