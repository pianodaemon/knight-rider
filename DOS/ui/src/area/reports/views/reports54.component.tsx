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

export const Report54 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport54Action,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2012');
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  const optionsFiscals = [
    { value: 'asf',   label: 'ASF'  ,  tk:'ASFP'},
    { value: 'asenl', label: 'ASENL',  tk:'ASEP'},
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId]);
  const classes = useStyles();
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
           {report && report.data_rows && report.data_rows.map((dep: any) =>
             <tr> 
               <td>{dep.dep}</td> 
               <td style={{textAlign: 'center'}} >{dep.tipo_obs}</td>
               <td className={classes.cantObs} >{dep.c_sol}</td>
               <td className={classes.montos} >{<NumberFormat value={dep.m_sol} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
               <td className={classes.cantObs} >{dep.c_analisis}</td>
               <td className={classes.montos} >{<NumberFormat value={dep.m_analisis} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
               <td className={classes.cantObs} >{dep.c_no_sol}</td>
               <td className={classes.montos} >{<NumberFormat value={dep.m_no_sol} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
             </tr>
          )
          }   
          { report && report.sum_rows &&
            <tr> 
              <td style={{fontWeight: "bold"}} colSpan={2}> Totales</td> 
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_sol}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ <NumberFormat value={report.sum_rows.m_sol.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_analisis}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ <NumberFormat value={report.sum_rows.m_analisis.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
              <td style={{fontWeight: "bold", textAlign: "center"}}>{report.sum_rows.c_no_sol}</td>
              <td style={{fontWeight: "bold", textAlign: "right"}}>{ <NumberFormat value={report.sum_rows.m_no_sol.valueOf()} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
            </tr>
          }           
          
        </tbody>
      </table>
    </div>
  );
};
