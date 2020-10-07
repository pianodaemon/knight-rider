/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { range } from 'src/shared/utils/range.util';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux'
import { resolvePermission } from 'src/shared/utils/permissions.util';

type Props = {
  loading: boolean,
  loadReport57Action: Function,
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
      },
      '& td': {
        border: 'solid 1px #fafafa',
        padding: '3px 10px',
      },
      '& tr:nth-child(odd)': {
        border: 'solid 1px #fafafa',
        background: 'rgba(0,0,0,0.03)',
      },
    },
    tableWhole: {
      borderSpacing: '0px !important',
      border: 'solid 1px #fafafa',
      width: '100%',
    },
    titrow: {
      background: '#fff !important',
      boxShadow: '0 2px 15px 0 rgba(0,0,0,0.15)',
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

export const Report57 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport57Action,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const optionsFiscals = [
    { value: 'SFP',   label: 'SFP',   tk: 'SFPR' },
    { value: 'ASF',   label: 'ASF',   tk: 'ASFR' },
    { value: 'ASENL', label: 'ASENL', tk: 'ASER' },
    { value: 'CYTG',  label: 'CYTG',  tk: 'CYTR' },
  ].filter( option => isVisible( option.tk ));
  const [fiscal , setFiscal ] = useState<any>(optionsFiscals.length ? optionsFiscals[0].value : null );
  const [entidad , setEntidad ] = useState<any>(fiscal);
  useEffect(() => {
    if( divisionId || divisionId === 0 ){
      loadReport57Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscal, division_id: divisionId });
    }
    setEntidad(fiscal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId]);
  const classes = useStyles();
  const formatMoney = ( monto: number): string =>  {
    let valueStringFixed2 = monto.toFixed(2);
    let valueArray = valueStringFixed2.split('');
    let arrayReverse = valueArray.reverse();
    let valueString = '';
    for(let i in arrayReverse ) {
      let st:number = Number(i);
      valueString = arrayReverse[i] + valueString;
      let sti:number;
      sti = (st - 2);
      if( (sti%3)===0 && st !== 2 && st !== (arrayReverse.length - 1) ){
        valueString = ',' + valueString
      }
    }
    return valueString;
  };
  const formatPercent = (monto:number, total:number): string => {
    let v = ((monto*100)/total).toFixed(1);
    let vr = v[v.length-1] === '0' ? ((monto*100)/total).toFixed(0) : v;
    return vr + ' %';
  };
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Tipo de Observación</span>
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

      </div>


      <table className={classes.tableWhole}> 
        <tbody className={classes.tableReports} >
          <tr >    
            <th colSpan={6}> {entidad} </th> 
          </tr> 
          <tr className={classes.titrow}>    
            <th  style={{background:'#ffffff', color: '#333333',}}>Secretaría/Entidad/Municipio</th> 
            <th >Tipo</th> 
            <th >Cantidad Obs.</th> 
            <th >% Obs.</th> 
            <th >Monto</th> 
            <th >% Monto</th> 
          </tr> 
          {report && report.data_rows && report.data_rows.map((dep: any) =>
            <tr> 
              <td>{dep.dep}</td> 
              <td style={{textAlign: 'center'}} >{dep.tipo}</td>
              <td className={classes.cantObs} >{dep.c_obs}</td>
              <td style={{textAlign: "right", whiteSpace: "nowrap"}} > {formatPercent( dep.c_obs, report.sum_rows.c_obs ) } </td>
              <td className={classes.montos} >{ formatMoney(dep.monto) }</td>
              <td style={{textAlign: "right", whiteSpace: "nowrap"}} >{formatPercent( dep.monto, report.sum_rows.monto ) }</td>
            </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} > Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> { report.sum_rows.c_obs }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> 100 %</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> { formatMoney( report.sum_rows.monto )}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> 100 %</td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
