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
  loadReportsAction: Function,
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

export const Report52Preliminaries = (props: Props) => {
  const {
    report,
    // loading,
    loadReportsAction,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  useEffect(() => {
    if( divisionId || divisionId === 0 ){
      loadReportsAction({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, division_id: divisionId});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, divisionId]);
  const classes = useStyles();
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const isVisibleFiscal = { 'sfp' : isVisible('SFPR'), 'asf' : isVisible('ASFR'), 'asenl' : isVisible('ASER'), 'cytg' : isVisible('CYTR') };
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado Total de Observaciones por Ente Fiscalizador Informe de Resultados</span>
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
      </div>

      <ReactHTMLTableToExcel
         id="downloadTableXlsButton"
         className="downloadTableXlsButton"
         table="table-to-xls"
         filename="Reporte"
         sheet="tablexls"
         buttonText="Descargar Reporte"
      />
      <table className={classes.tableWhole} id="table-to-xls"> 
        <tbody className={classes.tableReports} >

          <tr style={{display: 'none'}} >    
            <th colSpan={8} > Reporte Ejecutivo Concentrado Total de Observaciones por Ente Fiscalizador Informe de Resultados </th> 
          </tr> 
          <tr style={{display: 'none'}} ></tr> 
          <tr style={{display: 'none'}} >    
            <td colSpan={2} > Desde: {yearIni} </td> 
            <td colSpan={2} > Hasta: {yearEnd} </td> 
          </tr> 
          <tr style={{display: 'none'}} ></tr>

          <tr className={classes.titrow}>    
            <th colSpan={2}>ASF</th> 
            <th colSpan={2}>SFP</th> 
            <th colSpan={2}>ASENL</th> 
            <th colSpan={2}>CyTG</th> 
            <th colSpan={2}>Total</th> 
          </tr> 
          <tr style={{ fontWeight: "bold"}}> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto (Miles)</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto (Miles)</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto (Miles)</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto (Miles)</td> 
            <td className={classes.cantObs} >Cant. Obs.</td> 
            <td className={classes.montos} >Monto (Miles)</td> 
          </tr> 
             { report && report.sum_rows &&
             <tr> 
               
               <td className={classes.cantObs}>{  isVisibleFiscal.asf   ? report.sum_rows.c_asf                : '-' }</td>
               <td className={classes.montos} > <MoneyFormat isVisibleFiscal={isVisibleFiscal.asf} monto={report.sum_rows.m_asf.valueOf()} /> </td>
               <td className={classes.cantObs}>{  isVisibleFiscal.sfp   ? report.sum_rows.c_sfp                : '-' }</td>
               <td className={classes.montos} > <MoneyFormat isVisibleFiscal={isVisibleFiscal.sfp} monto={report.sum_rows.m_sfp.valueOf()} /> </td>
               <td className={classes.cantObs}>{  isVisibleFiscal.asenl ? report.sum_rows.c_asenl              : '-' }</td>
               <td className={classes.montos} > <MoneyFormat isVisibleFiscal={isVisibleFiscal.asenl} monto={report.sum_rows.m_asenl.valueOf()} /> </td>
               <td className={classes.cantObs}>{  isVisibleFiscal.cytg  ? report.sum_rows.c_cytg               : '-' }</td>
               <td className={classes.montos} > <MoneyFormat isVisibleFiscal={isVisibleFiscal.cytg} monto={report.sum_rows.m_cytg.valueOf()} /> </td>
               <td className={classes.cantObs}>{ (isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg) ? (report.sum_rows.c_total)             : '-' } </td>
               <td className={classes.montos} > <MoneyFormat isVisibleFiscal={(isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg)} monto={report.sum_rows.m_total.valueOf()} /> </td>
             </tr>
               
             }
            
          
        </tbody>
      </table>
    </div>
  );
};
