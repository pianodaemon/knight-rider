/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { range } from 'src/shared/utils/range.util';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import { resolvePermission } from 'src/shared/utils/permissions.util';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import NumberFormat from 'react-number-format';
import { Decimal } from 'decimal.js';

type Props = {
  loading: boolean,
  loadReport54Action: Function,
  report: any,
  divisionId: number,
};

const useStyles = makeStyles(() =>
  createStyles({
    Container: {
      background: 'white',
      padding: '17px 10px',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);',
    },
    tableReports: {
      border: 'solid 1px #fafafa',
      '& th': {
        border: 'solid 1px #fafafa',
        padding: '5px 10px;',
        borderTopLeftRadius: '6px;',
        borderTopRightRadius: '6px;',
        background: '#374fc0;',
        color: 'white;',
      },
      '& td': {
        border: 'solid 1px #fafafa',
        padding: '3px 10px',
      },
      '& tr:nth-child(odd)': {
        border: 'solid 1px #fafafa',
        background: '#f4f4f4',
      },
    },
    tableWhole: {
      borderSpacing: '0px !important',
      border: 'solid 1px #fafafa',
      width: '100%',
    },
    titrow: {
      background: '#fff !important',
    },
    titlereport: {
      fontSize: '1.25rem',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '1.6',
      letterSpacing: '0.0075em',
    },
    filters: {
      margin: '20px',
    },
    labelSelectYear:{
      display: 'inline',
      marginRight: '10px',
    },
    selectYearContainer: {
      display: 'inline-block',
      margin: '0 10px',
    },
    buttonTodos: {
      fontSize: '1rem',
      padding: '5px 10px',
      marginLeft: '25px',
      background: '#ffffff',
      color: '#128aba',
      borderRadius: '5px',
      border: 'solid #128aba 1px',
    },
    montos: {
      textAlign: 'right',
    },
    cantObs: {
      textAlign: 'center',
    },
  })
);

const MoneyFormat = ( props: any ) => {
  const {
    monto,
    isVisibleFiscal,
  } = props;
  const val = isVisibleFiscal ? Decimal.div(monto, 1000).toNumber() : '-';
  const suf = val !== 0 && isVisibleFiscal ? '' : ''
  return(
    <NumberFormat value={val} displayType={'text'} thousandSeparator={true} decimalScale={1} fixedDecimalScale={true}  suffix={suf} />
  )
}

const TableReports = ( props: any ) => {
  const {
    report,
    entidad,
    yearIni,
    yearEnd,
    dependency,
  } = props;
  const classes = useStyles();
  let sum = {
      c_sol     : 0,
      m_sol     : new Decimal(0), 
      c_analisis: 0, 
      m_analisis: new Decimal(0), 
      c_no_sol  : 0, 
      m_no_sol  : new Decimal(0),
  }
  const sumRows = () => {
    report.forEach( (dep:any) => {
      sum.c_sol      += dep.c_sol                                      ;
      sum.m_sol       = Decimal.add( sum.m_sol, dep.m_sol )            ;
      sum.c_analisis += dep.c_analisis                                 ;
      sum.m_analisis  = Decimal.add( sum.m_analisis, dep.m_analisis )  ;
      sum.c_no_sol   += dep.c_no_sol                                   ;
      sum.m_no_sol    = Decimal.add( sum.m_no_sol, dep.m_no_sol )      ;
    })
  };
  sumRows();
  return(
    <table className={classes.tableWhole} id="table-to-xls"> 
      <tbody className={classes.tableReports} >

        <tr style={{display: 'none'}} >    
          <th colSpan={8} > Reporte Ejecutivo Concentrado de Observaciones por Estatus de la Observación del Informe Preliminar </th> 
        </tr> 
        <tr style={{display: 'none'}} >    
        </tr> 
        <tr style={{display: 'none'}} >    
          <td colSpan={2} > Desde: {yearIni}              </td> 
          <td colSpan={2} > Hasta: {yearEnd}              </td> 
          <td colSpan={2} > Ente Fiscalizador: {entidad}  </td> 
          <td colSpan={2} > Dependencia: {dependency}     </td> 
        </tr> 
        <tr style={{display: 'none'}} >    
        </tr> 

        <tr className={classes.titrow}>    
          <th rowSpan={2} style={{background:'#ffffff', color: '#333333',}}>Secretaría/Entidad/Municipio</th> 
          <th rowSpan={2} style={{background:'#ffffff', color: '#333333',}}>Tipo de Observación</th> 
          <th colSpan={2}>SOLVENTADAS</th> 
          <th colSpan={2}>EN ANÁLISIS</th> 
          <th colSpan={2}>NO SOLVENTADAS</th> 
        </tr> 
        <tr style={{ fontWeight: "bold"}}> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto (Miles)</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto (Miles)</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto (Miles)</td> 
        </tr> 
         {report.map((dep: any) =>
           <tr> 
             <td>{dep.dep}</td> 
             <td style={{textAlign: 'center'}} >{dep.tipo_obs}</td>
             <td className={classes.cantObs} >{dep.c_sol}</td>
             <td className={classes.montos} > <MoneyFormat isVisibleFiscal={true} monto={dep.m_sol} /> </td>
             <td className={classes.cantObs} >{dep.c_analisis}</td>
             <td className={classes.montos} > <MoneyFormat isVisibleFiscal={true} monto={dep.m_analisis} /> </td>
             <td className={classes.cantObs} >{dep.c_no_sol}</td>
             <td className={classes.montos} > <MoneyFormat isVisibleFiscal={true} monto={dep.m_no_sol} /> </td>
           </tr>
        )
        }   
        <tr> 
          <td style={{fontWeight: "bold"}} colSpan={2}> Totales</td> 
          <td style={{fontWeight: "bold", textAlign: "center"}}>{sum.c_sol}</td>
          <td style={{fontWeight: "bold", textAlign: "right"}}> <MoneyFormat isVisibleFiscal={true} monto={sum.m_sol.valueOf()} /> </td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{sum.c_analisis}</td>
          <td style={{fontWeight: "bold", textAlign: "right"}}> <MoneyFormat isVisibleFiscal={true} monto={sum.m_analisis.valueOf()} /> </td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{sum.c_no_sol}</td>
          <td style={{fontWeight: "bold", textAlign: "right"}}> <MoneyFormat isVisibleFiscal={true} monto={sum.m_no_sol.valueOf()} /> </td>
        </tr>
      </tbody>
    </table>
  );
}


export const Report54 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport54Action,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2000');
  const [dependency, setDependency] = useState<any>('Todas');
  const [tipoObs   , setTipoObs]    = useState<any>('Todas');
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const optionsFiscals = [
    { value: 'asf',   label: 'ASF'  ,  tk:'ASFP'},
    { value: 'asenl', label: 'ASENL',  tk:'ASEP'},
    { value: 'cytg',  label: 'CyTG',   tk:'CYTP'},
  ].filter( option => isVisible( option.tk ));
  if (optionsFiscals.length >= 2){
    optionsFiscals.push( { value: 'Todas', label: 'Todas',  tk:''    } )
  }
  const [fiscal , setFiscal ] = useState<any>(optionsFiscals.length ? optionsFiscals[0].value : null );
  useEffect(() => {
    var fiscalUpdate = (fiscal === 'Todas') ? '' : fiscal
    if( divisionId || divisionId === 0 ){
      loadReport54Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscalUpdate, division_id: divisionId});
    }
    setDependency('Todas');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId]);
  const classes = useStyles();
  const setVisibleRows = (dep: any): boolean => {
    if(dep.dep === dependency || dependency === '' || dependency === 'Todas' || dependency === '0'){
      if(dep.tipo_obs === tipoObs || tipoObs === '' || tipoObs === 'Todas' || tipoObs === '0'){
        return true;
      }else{return false}
    }else{return false}
  };
  let auxObjOfDependencies:any = {};
  let auxObjOfTipoObs:any = {};
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Estatus de la Observación del Informe Preliminar</span>
      </div>

      <div className={classes.filters}>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Desde:</InputLabel>
          <Select
            labelId="desde"
            value={yearIni}
            onChange={(e)=> {setYearIni(e.target.value);}}
          >
            {range(2000, new Date().getFullYear()).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Hasta:</InputLabel>
          <Select
            labelId="hasta"
            value={yearEnd}
            onChange={(e)=> {setYearEnd(e.target.value);}}
          >
            {range(2000, new Date().getFullYear()).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Ente Fiscalizador:</InputLabel>
          <Select
            labelId="fiscal"
            value={fiscal}
            onChange={(e)=> {setFiscal(e.target.value);}}
          >
            {optionsFiscals.map((item) => {
              return (
                <MenuItem
                  value={item.value}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Dependencia:</InputLabel>
          <Select
            labelId="dependency"
            value={dependency}
            onChange={(e)=> {setDependency(e.target.value);}}
          >
            <MenuItem
              value={'Todas'}
            >
              -- Todas --
            </MenuItem>
            {report && report.data_rows && 
              report.data_rows.map((item:any) => {
              if( !(auxObjOfDependencies[item.dep]) ){
                auxObjOfDependencies[item.dep] = 1;
                return (
                  <MenuItem
                    value={item.dep}
                  >
                    {item.dep}
                  </MenuItem>
                );
              }
              return <React.Fragment />
            })}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Tipo de Observación:</InputLabel>
          <Select
            labelId="tipoObs"
            value={tipoObs}
            onChange={(e)=> {setTipoObs(e.target.value);}}
          >
            <MenuItem
              value={'Todas'}
            >
              -- Todas --
            </MenuItem>
            {report && report.data_rows && 
              report.data_rows.map((item:any) => {
              if( !(auxObjOfTipoObs[item.tipo_obs]) ){
                auxObjOfTipoObs[item.tipo_obs] = 1;
                return (
                  <MenuItem
                    value={item.tipo_obs}
                  >
                    {item.tipo_obs}
                  </MenuItem>
                );
              }
              return <React.Fragment />
            })}
          </Select>
        </div>
      </div>


      <ReactHTMLTableToExcel
         id="downloadTableXlsButton"
         className="downloadTableXlsButton"
         table="table-to-xls"
         filename="Reporte"
         sheet="tablexls"
         buttonText="Descargar Reporte"
      />

      {report && report.data_rows && 
        <TableReports report={report.data_rows.filter(setVisibleRows) } entidad={fiscal} yearIni={yearIni} yearEnd={yearEnd} dependency={dependency} />
      }
      
    </div>
  );
};
