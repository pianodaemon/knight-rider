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
  loadReportsAction: Function,
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
  })
);

export const ReportPreliminaries = (props: Props) => {
  const {
    report,
    // loading,
    loadReportsAction,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  useEffect(() => {
    loadReportsAction({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni]);
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
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados</span>
        <Link to="/reports-52">
          <button type="button" className={classes.buttonTodos} >
            <span>&rarr; Todos</span>
          </button>
        </Link>
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
      </div>


      <table className={classes.tableWhole}> 
        <tbody className={classes.tableReports} >
          <tr className={classes.titrow}>    
            <th rowSpan={2} style={{backgroundColor: "#fff", color: "#000"}}>Secretaría/Entidad/Municipio</th> 
            <th rowSpan={2} style={{backgroundColor: "#fff", color: "#000"}}>Ejercicio</th> 
            <th colSpan={2}>ASF</th> 
            <th colSpan={2}>SFP</th> 
            <th colSpan={2}>ASENL</th> 
            <th colSpan={2}>CyTG</th> 
            <th colSpan={2}>Total</th> 
          </tr> 
          <tr style={{ fontWeight: "bold"}}> 
            <td>Cant. Obs.</td> 
            <td>Monto</td> 
            <td>Cant. Obs.</td> 
            <td>Monto</td> 
            <td>Cant. Obs.</td> 
            <td>Monto</td> 
            <td>Cant. Obs.</td> 
            <td>Monto</td> 
            <td>Cant. Obs.</td> 
            <td>Monto</td> 
          </tr> 
          {report && report.data_rows && report.data_rows.map((dep: any) =>
             <tr> 
               <td>{dep.dep}</td> 
               <td>{dep.ej}</td>
               <td>{dep.c_asf}</td>
               <td>{dep.m_asf.toFixed( 2 )}</td>
               <td>{dep.c_sfp}</td>
               <td>{dep.m_sfp.toFixed( 2 )}</td>
               <td>{dep.c_asenl}</td>
               <td>{dep.m_asenl.toFixed( 2 )}</td>
               <td>{dep.c_cytg}</td>
               <td>{dep.m_cytg.toFixed( 2 )}</td>
               <td> { dep.c_asf + dep.c_sfp + dep.c_asenl + dep.c_cytg } </td>
               <td> { (dep.m_asf + dep.m_sfp + dep.m_asenl + dep.m_cytg).toFixed( 2 )  } </td>
             </tr>
          )
          }
        </tbody>
      </table>
    </div>
  );
};
