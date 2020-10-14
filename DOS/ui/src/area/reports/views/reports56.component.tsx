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
  loadReport56Action: Function,
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

export const Report56 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport56Action,
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
  useEffect(() => {
    if( divisionId || divisionId === 0 ){
      loadReport56Action({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, fiscal: fiscal, reporte_num: 'reporte56', division_id: divisionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId]);
  const classes = useStyles();
  const formatPercent = (monto:number, total:number): string => {
    let m = new Decimal(monto)
    let v = ((m.times(100)).dividedBy(total)).toFixed(1);
    let vr = v[v.length-1] === '0' ? ((m.times(100)).dividedBy(total)).toFixed(0) : v;
    return vr + ' %';
  };
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo de Observaciones Pendientes de Solventar por Ente Fiscalizador</span>
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

      <ReactHTMLTableToExcel
         id="downloadTableXlsButton"
         className="downloadTableXlsButton"
         table="table-to-xls"
         filename="Reporte"
         sheet="tablexls"
         buttonText="Descargar Reporte"
      />
      <div style={{background: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center", padding: "5px 0", fontWeight: "bold", marginBottom: "0px" }}>
        Pendientes de Solventar
      </div>

      <table className={classes.tableWhole} id="table-to-xls"> 
        <tbody className={classes.tableReports} >
          <tr className={classes.titrow}>    
            <th >Secretaría/Entidad/Municipio</th> 
            <th >Ejercicio</th> 
            <th >Tipo</th> 
            <th >Clasificación</th> 
            <th >Cantidad Obs.</th> 
            <th >% Obs.</th> 
            <th >Monto</th> 
            <th >% Monto</th> 
          </tr> 
          {report && report.data_rows && report.data_rows.map((dep: any) =>
            <tr> 
              <td>{dep.dep}</td> 
              <td style={{textAlign: 'center'}} >{dep.ej}</td>
              <td style={{textAlign: 'center'}} >{dep.tipo}</td>
              <td style={{textAlign: 'center'}} >{dep.clasif_name}</td>
              <td className={classes.cantObs} >{dep.c_obs}</td>
              <td style={{textAlign: "right", whiteSpace: "nowrap"}} > {formatPercent( dep.c_obs, report.sum_rows.c_obs ) } </td>
              <td className={classes.montos} >{ <NumberFormat value={dep.monto} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> }</td>
              <td style={{textAlign: "right", whiteSpace: "nowrap"}} >{formatPercent( dep.monto, report.sum_rows.monto ) }</td>
            </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} > Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> </td>
              <td style={{fontWeight: "bold", textAlign: "center"}}></td>
              <td style={{fontWeight: "bold", textAlign: "center"}}> { report.sum_rows.c_obs }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> 100 %</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> { <NumberFormat value={ report.sum_rows.monto.valueOf() } displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> }</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}> 100 %</td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
