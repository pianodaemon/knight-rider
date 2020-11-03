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

const TableReports = ( props: any ) => {
  const {
    report,
    isVisibleFiscal,
    yearIni,
    yearEnd,
    dependency,
  } = props;
  const classes = useStyles();
  let sum = {
      c_asf    : 0              ,
      m_asf    : new Decimal(0) , 
      c_sfp    : 0              , 
      m_sfp    : new Decimal(0) , 
      c_asenl  : 0              , 
      m_asenl  : new Decimal(0) , 
      c_cytg   : 0              ,
      m_cytg   : new Decimal(0) ,
      c_total  : 0              ,
      m_total  : new Decimal(0) ,
  }
  const sumRows = () => {
    report.forEach( (dep:any) => {
      sum.c_asf   += dep.c_asf                                ;
      sum.m_asf    = Decimal.add( sum.m_asf, dep.m_asf )      ;
      sum.c_sfp   += dep.c_sfp                                ;
      sum.m_sfp    = Decimal.add( sum.m_sfp, dep.m_sfp )      ;
      sum.c_asenl += dep.c_asenl                              ;
      sum.m_asenl  = Decimal.add( sum.m_asenl, dep.m_asenl )  ;
      sum.c_cytg  += dep.c_cytg                               ;
      sum.m_cytg   = Decimal.add( sum.m_cytg, dep.m_cytg )    ;
      sum.c_total  = sum.c_asf + sum.c_sfp + sum.c_asenl + sum.c_cytg;
      sum.m_total  = (sum.m_asf).plus(sum.m_sfp).plus(sum.m_asenl).plus(sum.m_cytg) ;
    })
  };
  sumRows();
  return(
    <table className={classes.tableWhole} id="table-to-xls"> 
      <tbody className={classes.tableReports} >

        <tr style={{display: 'none'}} >    
          <th colSpan={8} > Reporte Ejecutivo Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados </th> 
        </tr> 
        <tr style={{display: 'none'}} >    
        </tr> 
        <tr style={{display: 'none'}} >    
          <td colSpan={2} > Desde: {yearIni}              </td> 
          <td colSpan={2} > Hasta: {yearEnd}              </td> 
          <td colSpan={2} > Dependencia: {dependency}     </td> 
        </tr> 
        <tr style={{display: 'none'}} >    
        </tr> 

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
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto</td> 
          <td className={classes.cantObs} >Cant. Obs.</td> 
          <td className={classes.montos} >Monto</td> 
        </tr> 
        {report.map((dep: any) =>
           <tr> 
             <td>{dep.dep}</td> 
             <td>{dep.ej}</td>
             <td className={classes.cantObs} >{ isVisibleFiscal.asf   ? dep.c_asf : '-' }</td>
             <td className={classes.montos}  >{ isVisibleFiscal.asf   ? <NumberFormat value={dep.m_asf} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
             <td className={classes.cantObs} >{ isVisibleFiscal.sfp   ? dep.c_sfp                : '-' }</td>
             <td className={classes.montos}  >{ isVisibleFiscal.sfp   ? <NumberFormat value={dep.m_sfp} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
             <td className={classes.cantObs} >{ isVisibleFiscal.asenl ? dep.c_asenl              : '-' }</td>
             <td className={classes.montos}  >{ isVisibleFiscal.asenl ? <NumberFormat value={dep.m_asenl} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
             <td className={classes.cantObs} >{ isVisibleFiscal.cytg  ? dep.c_cytg               : '-' }</td>
             <td className={classes.montos}  >{ isVisibleFiscal.cytg  ? <NumberFormat value={dep.m_cytg} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
             <td className={classes.cantObs} >{ (isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg) ? (dep.c_asf + dep.c_sfp + dep.c_asenl + dep.c_cytg)            : '-' } </td>
             <td className={classes.montos}  >{ (isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg) ? <NumberFormat value={dep.m_asf + dep.m_sfp + dep.m_asenl + dep.m_cytg} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' } </td>
           </tr>
        )
        }
        <tr> 
          <td style={{fontWeight: "bold"}} colSpan={2}>Total</td> 
          <td style={{fontWeight: "bold", textAlign: "center"}}>{ isVisibleFiscal.asf   ? sum.c_asf                : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "right"}} >{ isVisibleFiscal.asf   ? <NumberFormat value={sum.m_asf.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{ isVisibleFiscal.sfp   ? sum.c_sfp                : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "right"}} >{ isVisibleFiscal.sfp   ? <NumberFormat value={sum.m_sfp.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{ isVisibleFiscal.asenl ? sum.c_asenl              : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "right"}} >{ isVisibleFiscal.asenl ? <NumberFormat value={sum.m_asenl.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{ isVisibleFiscal.cytg  ? sum.c_cytg               : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "right"}} >{ isVisibleFiscal.cytg  ? <NumberFormat value={sum.m_cytg.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' }</td>
          <td style={{fontWeight: "bold", textAlign: "center"}}>{ (isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg) ? (sum.c_total)            : '-' } </td>
          <td style={{fontWeight: "bold", textAlign: "right"}} >{ (isVisibleFiscal.asf || isVisibleFiscal.sfp || isVisibleFiscal.asenl || isVisibleFiscal.cytg) ? <NumberFormat value={sum.m_total.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : '-' } </td>
        </tr>
      </tbody>
    </table>
  );
}

export const ReportPreliminaries = (props: Props) => {
  const {
    report,
    // loading,
    loadReportsAction,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2000');
  const [dependency, setDependency] = useState<any>('Todas');
  useEffect(() => {
    if( divisionId || divisionId === 0 ){
      loadReportsAction({ ejercicio_fin: yearEnd, ejercicio_ini: yearIni, division_id: divisionId});
    }
    setDependency('Todas');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, divisionId]);
  const classes = useStyles();
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const isVisibleFiscal = { 'sfp' : isVisible('SFPR'), 'asf' : isVisible('ASFR'), 'asenl' : isVisible('ASER'), 'cytg' : isVisible('CYTR') };
  const setVisibleRows = (dep: any): boolean => {
    if(dep.dep === dependency || dependency === '' || dependency === 'Todas' || dependency === '0'){
      return true;
    }else{return false}
  };
  let auxObj:any = {};
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>Reporte Ejecutivo Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados</span>
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
              if( !(auxObj[item.dep]) ){
                auxObj[item.dep] = 1;
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
        <TableReports report={report.data_rows.filter(setVisibleRows) }  isVisibleFiscal={isVisibleFiscal} yearIni={yearIni} yearEnd={yearEnd} dependency={dependency} />
      }
    </div>
  );
};
