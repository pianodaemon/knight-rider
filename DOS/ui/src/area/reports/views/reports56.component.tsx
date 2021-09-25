/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { range } from 'src/shared/utils/range.util';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { resolvePermission } from 'src/shared/utils/permissions.util';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import NumberFormat from 'react-number-format';
import { Decimal } from 'decimal.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
      boxShadow:
        '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);',
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
    labelSelectYear: {
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
  }),
);

const MoneyFormat = (props: any) => {
  const { monto, isVisibleFiscal } = props;
  const val = isVisibleFiscal ? Decimal.div(monto, 1000).toNumber() : '-';
  const suf = val !== 0 && isVisibleFiscal ? '' : '';
  return (
    <NumberFormat
      value={val}
      displayType={'text'}
      thousandSeparator={true}
      decimalScale={1}
      fixedDecimalScale={true}
      suffix={suf}
    />
  );
};

const TableReports = (props: any) => {
  const {
    report,
    entidad,
    yearIni,
    yearEnd,
    dependency,
    isClasif,
    atributoNameTipoMonto,
    titleTable,
  } = props;
  const classes = useStyles();
  const titleColumn = isClasif === 'True' ? 'Clasificación' : 'Observación';
  const formatPercent = (monto: number, total: number): string => {
    if (total > 0) {
      let m = new Decimal(monto);
      let v = m.times(100).dividedBy(total).toFixed(1);
      let vr =
        v[v.length - 1] === '0' ? m.times(100).dividedBy(total).toFixed(0) : v;
      return vr + ' %';
    } else {
      return '0 %';
    }
  };
  let sum = {
    c_obs: 0,
    m: new Decimal(0),
  };
  let rep = report.filter((row: any) => {
    if ((atributoNameTipoMonto === 'm_sol' || atributoNameTipoMonto === 'monto') && row[atributoNameTipoMonto] === 0.0) {
      return false;
    } else {
      return true;
    }
  });
  const sumRows = () => {
    report.forEach((dep: any) => {
      sum.c_obs += dep.c_obs;
      sum.m = Decimal.add(sum.m, dep[atributoNameTipoMonto]);
    });
  };
  sumRows();
  return (
    <table className={classes.tableWhole} id="table-to-xls">
      <tbody className={classes.tableReports}>
        {/* tr auxiliares para el archivo */}
        <tr style={{ display: 'none' }}>
          <th colSpan={8}>
            {' '}
            Reporte Ejecutivo de Observaciones Pendientes de Solventar por Ente
            Fiscalizador{' '}
          </th>
        </tr>
        <tr style={{ display: 'none' }}></tr>
        <tr style={{ display: 'none' }}>
          <td colSpan={2}> Desde: {yearIni} </td>
          <td colSpan={2}> Hasta: {yearEnd} </td>
          <td colSpan={2}> Ente Fiscalizador: {entidad} </td>
          <td colSpan={2}> Dependencia: {dependency} </td>
        </tr>
        <tr style={{ display: 'none' }}></tr>

        <tr>
          <th colSpan={8}> {titleTable} </th>
        </tr>
        <tr className={classes.titrow}>
          <th>Secretaría/Entidad/Municipio</th>
          <th>Ejercicio</th>
          <th>Tipo</th>
          <th> {titleColumn} </th>
          <th>Cantidad Obs.</th>
          <th>% Obs.</th>
          <th>Monto (Miles)</th>
          <th>% Monto</th>
        </tr>
        {report.map((dep: any, index: number) => (
          <tr key={`row-${index}`}>
            <td>{dep.dep}</td>
            <td style={{ textAlign: 'center' }}>{dep.ej}</td>
            <td style={{ textAlign: 'center' }}>{dep.tipo}</td>
            <td style={{ textAlign: 'center' }}>{dep.clasif_name}</td>
            <td className={classes.cantObs}>{dep.c_obs}</td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              {' '}
              {formatPercent(dep.c_obs, sum.c_obs)}{' '}
            </td>
            <td className={classes.montos}>
              {' '}
              <MoneyFormat
                isVisibleFiscal={true}
                monto={dep[atributoNameTipoMonto]}
              />{' '}
            </td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              {formatPercent(dep[atributoNameTipoMonto], sum.m.toNumber())}
            </td>
          </tr>
        ))}
        <tr>
          <td style={{ fontWeight: 'bold' }}> Totales</td>
          <td style={{ fontWeight: 'bold', textAlign: 'center' }}></td>
          <td style={{ fontWeight: 'bold', textAlign: 'center' }}> </td>
          <td style={{ fontWeight: 'bold', textAlign: 'center' }}></td>
          <td style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {' '}
            {sum.c_obs}
          </td>
          <td style={{ fontWeight: 'bold', textAlign: 'right' }}> 100 %</td>
          <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
            {' '}
            <MoneyFormat isVisibleFiscal={true} monto={sum.m.toNumber()} />{' '}
          </td>
          <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
            {' '}
            {sum.m.toNumber() === 0 ? '0' : '100'} %
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const Report56 = (props: Props) => {
  const {
    report,
    // loading,
    loadReport56Action,
    divisionId,
  } = props;
  const [yearEnd, setYearEnd] = useState<any>('2020');
  const [yearIni, setYearIni] = useState<any>('2000');
  const [isClasif, setIsClasif] = useState<any>('True');
  const [dependency, setDependency] = useState<any>('Todas');
  const [tipoObs, setTipoObs] = useState<any>('Todas');
  const [tipoMonto, setTipoMonto] = useState<any>('pendiente');
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean =>
    resolvePermission(permissions?.claims?.authorities, app);
  const optionsFiscals = [
    { value: 'SFP', label: 'SFP', tk: 'SFPR' },
    { value: 'ASF', label: 'ASF', tk: 'ASFR' },
    { value: 'ASENL', label: 'ASENL', tk: 'ASER' },
    { value: 'CYTG', label: 'CYTG', tk: 'CYTR' },
  ].filter((option) => isVisible(option.tk));
  const [fiscal, setFiscal] = useState<any>(
    optionsFiscals.length ? optionsFiscals[0].value : null,
  );
  useEffect(() => {
    if (divisionId || divisionId === 0) {
      loadReport56Action({
        ejercicio_fin: yearEnd,
        ejercicio_ini: yearIni,
        fiscal: fiscal,
        reporte_num: 'reporte56',
        division_id: divisionId,
        is_clasif: isClasif,
      });
    }
    setDependency('Todas');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearEnd, yearIni, fiscal, divisionId, isClasif]);
  const classes = useStyles();
  const setVisibleRows = (dep: any): boolean => {
    //Si en el select esta seleccionada una dependencia y el la dep del tr es igual o esta seleccionado 'Todas'
    // console.log(dep);
    if (
      dep.dep === dependency ||
      dependency === '' ||
      dependency === 'Todas' ||
      dependency === '0'
    ) {
      if (
        dep.tipo === tipoObs ||
        tipoObs === '' ||
        tipoObs === 'Todas' ||
        tipoObs === '0'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const optionsTipoMonto = [
    { value: 'pendiente', label: 'Pendientes de Solventar' },
    { value: 'observado', label: 'Observados' },
    { value: 'solventado', label: 'Solventados' },
  ];
  const valTipoMonto: any = {
    pendiente: { title: 'Pendientes de Solventar', nameAttr: 'monto' },
    observado: { title: 'Observados', nameAttr: 'm_obs' },
    solventado: { title: 'Solventados', nameAttr: 'm_sol' },
  };
  let auxObjOfDependencies: any = {};
  let auxObjOfTipoObs: any = {};
  return (
    <div className={classes.Container}>
      <div>
        <span className={classes.titlereport}>
          Reporte Ejecutivo de Observaciones Pendientes de Solventar por Ente
          Fiscalizador
        </span>
      </div>

      <div className={classes.filters}>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>Desde:</InputLabel>
          <Select
            labelId="desde"
            value={yearIni}
            onChange={(e) => {
              setYearIni(e.target.value);
            }}
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
            onChange={(e) => {
              setYearEnd(e.target.value);
            }}
          >
            {range(2000, new Date().getFullYear()).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>
            Ente Fiscalizador:
          </InputLabel>
          <Select
            labelId="fiscal"
            value={fiscal}
            onChange={(e) => {
              setFiscal(e.target.value);
            }}
          >
            {optionsFiscals.map((item, index: number) => {
              return (
                <MenuItem key={`option-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>
            Dependencia:
          </InputLabel>
          <Select
            labelId="dependency"
            value={dependency}
            onChange={(e) => {
              setDependency(e.target.value);
            }}
          >
            <MenuItem value={'Todas'}>-- Todas --</MenuItem>
            {report &&
              report.data_rows &&
              report.data_rows.map((item: any, index: number) => {
                if (!auxObjOfDependencies[item.dep]) {
                  auxObjOfDependencies[item.dep] = 1;
                  return (
                    <MenuItem key={`option-${index}`} value={item.dep}>
                      {item.dep}
                    </MenuItem>
                  );
                }
                return null;
                // return <React.Fragment />
              })}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>
            Tipo de Observación:
          </InputLabel>
          <Select
            labelId="tipoObs"
            value={tipoObs}
            onChange={(e) => {
              setTipoObs(e.target.value);
            }}
          >
            <MenuItem value={'Todas'}>-- Todas --</MenuItem>
            {report &&
              report.data_rows &&
              report.data_rows.map((item: any, index: number) => {
                if (!auxObjOfTipoObs[item.tipo]) {
                  auxObjOfTipoObs[item.tipo] = 1;
                  return (
                    <MenuItem key={`option-${index}`} value={item.tipo}>
                      {item.tipo}
                    </MenuItem>
                  );
                }
                return null;
              })}
          </Select>
        </div>
        <div className={classes.selectYearContainer}>
          <InputLabel className={classes.labelSelectYear}>
            {' '}
            Tipo de Monto:
          </InputLabel>
          <Select
            labelId="tipoMonto"
            value={tipoMonto}
            onChange={(e) => {
              loadReport56Action({
                ejercicio_fin: yearEnd,
                ejercicio_ini: yearIni,
                fiscal: fiscal,
                reporte_num: 'reporte56',
                division_id: divisionId,
                is_clasif: isClasif,
                tipo_monto: e.target.value,
              });
              setTipoMonto(e.target.value);
            }}
          >
            {optionsTipoMonto.map((item, index: number) => {
              return (
                <MenuItem key={`option-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          defaultValue="True"
          onChange={(e) => {
            setIsClasif(e.target.value);
          }}
        >
          <FormControlLabel
            value="True"
            control={<Radio color="primary" />}
            label="Clasificación"
          />
          <FormControlLabel
            value="False"
            control={<Radio color="primary" />}
            label="Observación"
          />
        </RadioGroup>
      </div>

      <ReactHTMLTableToExcel
        id="downloadTableXlsButton"
        className="downloadTableXlsButton"
        table="table-to-xls"
        filename="Reporte"
        sheet="tablexls"
        buttonText="Descargar Reporte"
      />
      {report && report.data_rows && (
        <TableReports
          report={report.data_rows.filter(setVisibleRows)}
          entidad={fiscal}
          yearIni={yearIni}
          yearEnd={yearEnd}
          dependency={dependency}
          isClasif={isClasif}
          atributoNameTipoMonto={valTipoMonto[tipoMonto].nameAttr}
          titleTable={valTipoMonto[tipoMonto].title}
        />
      )}
    </div>
  );
};
