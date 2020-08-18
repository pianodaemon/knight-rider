/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { makeStyles, createStyles } from '@material-ui/core/styles';

type Props = {
  loading: boolean,
  loadReport61Action: Function,
  report: any,
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
        border: '1px solid rgba(0,0,0,0.02)',
        padding: '5px 10px;',
      },
      '& td': {
        border: 'solid 1px #fafafa',
        padding: '3px 10px',
      },
      '& tr:nth-child(odd)': {
        borderRigth: '1px solid rgba(0,0,0,0.02)',
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

export const Report61 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport61Action,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const [fiscal , setFiscal ] = useState<any>('SFP');
  const [pre_ires , setPreIres ] = useState<any>('pre');
  useEffect(() => {
    loadReport61Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscal, obs_c: pre_ires});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, pre_ires]);
  const classes = useStyles();
  const options = [
    { value: '2012', label: '2012' },
    { value: '2013', label: '2013' },
    { value: '2014', label: '2014' },
    { value: '2015', label: '2015' },
    { value: '2016', label: '2016' },
    { value: '2017', label: '2017' },
    { value: '2018', label: '2018' },
    { value: '2019', label: '2019' },
    { value: '2020', label: '2020' },
  ];
  const optionsFiscals = [
    { value: 'SFP',   label: 'SFP' },
    { value: 'ASF',   label: 'ASF' },
    { value: 'ASENL', label: 'ASENL' },
    { value: 'CYTG',  label: 'CYTG' },
  ];
  const optionsPreIres = [
    { value: 'pre',   label: 'Preliminares' },
    { value: 'ires',  label: 'Informe de Resultados' },
  ];
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
    let vr = v[v.length-1] == '0' ? ((monto*100)/total).toFixed(0) : v;
    return vr + ' %';
  };
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte de Detalle de la Observación, Estatus, Entidad, Tipo de Observación y Ente Fiscalizador</span>
      </div>

      <div className={classes.filters}>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Desde:</InputLabel>
          <Select
            labelId="desde"
            value={yearIni}
            onChange={(e)=> {setYearIni(e.target.value);}}
          >
            {options.map((item) => {
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
          <InputLabel className={classes.labelSelectYear}>Hasta:</InputLabel>
          <Select
            labelId="hasta"
            value={yearEnd}
            onChange={(e)=> {setYearEnd(e.target.value);}}
          >
            {options.map((item) => {
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
          <InputLabel className={classes.labelSelectYear}>Observación:</InputLabel>
          <Select
            labelId="pre_ires"
            value={pre_ires}
            onChange={(e)=> {setPreIres(e.target.value);}}
          >
            {optionsPreIres.map((item) => {
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
          <tr className={classes.titrow}>    
            <th >Secretaría/Entidad/Municipio</th> 
            <th >Cant. Obs.</th> 
            <th >Número de Obs.</th> 
            <th >Observación</th> 
            <th >Tipo de Observación</th> 
            <th >Monto</th> 
            <th >Estatus</th> 
          </tr> 
          {report && report.data_rows && report.data_rows.map((dep: any) =>
            <tr> 
              <td>{dep.dep}</td> 
              <td style={{textAlign: 'center'}} >{dep.c_obs}</td>
              <td style={{textAlign: 'center'}} >{dep.n_obs}</td>
              <td style={{textAlign: 'center', overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical'}} >{dep.obs}</td>
              <td className={classes.cantObs} >{dep.tipo}</td>
              <td className={classes.montos} >{ formatMoney(dep.monto) }</td>
              <td style={{textAlign: "center", whiteSpace: "nowrap"}} > { dep.estatus } </td>
            </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} > Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> </td>
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> </td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> { formatMoney( report.sum_rows.monto )}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}></td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
