/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles, createStyles } from '@material-ui/core/styles';

type Props = {
  loading: boolean,
  loadReport54Action: Function,
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

export const Report54 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport54Action,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const [fiscal , setFiscal ] = useState<any>('');
  useEffect(() => {
    loadReport54Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscal});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal]);
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
    { value: 'asf',   label: 'ASF' },
    { value: 'asenl', label: 'ASENL' },
    { value: '',      label: 'Todas' },
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

      </div>


      <table className={classes.tableWhole}> 
        <tbody className={classes.tableReports} >
          <tr className={classes.titrow}>    
            <th rowSpan={2} style={{background:'#ffffff', color: '#333333',}}>Secretaría/Entidad/Municipio</th> 
            <th rowSpan={2} style={{background:'#ffffff', color: '#333333',}}>Tipo de Observación</th> 
            <th colSpan={2}>SOLVENTADAS</th> 
            <th colSpan={2}>EN ANÁLISIS</th> 
            <th colSpan={2}>NO SOLVENTADAS</th> 
          </tr> 
          <tr style={{ fontWeight: "bold"}}> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto</td> 
          </tr> 
             {console.log(report)}
           {report && report.data_rows && report.data_rows.map((dep: any) =>
             <tr> 
               <td>{dep.dep}</td> 
               <td style={{textAlign: 'center'}} >{dep.tipo_obs}</td>
               <td className={classes.cantObs} >{dep.c_sol}</td>
               <td className={classes.montos} >{formatMoney(dep.m_sol)}</td>
               <td className={classes.cantObs} >{dep.c_analisis}</td>
               <td className={classes.montos} >{formatMoney(dep.m_analisis)}</td>
               <td className={classes.cantObs} >{dep.c_no_sol}</td>
               <td className={classes.montos} >{formatMoney(dep.m_no_sol)}</td>
             </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} colSpan={2}> Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_sol}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_sol)}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_analisis}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_analisis)}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_no_sol}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ formatMoney(report.sum_rows.m_no_sol)}</td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
