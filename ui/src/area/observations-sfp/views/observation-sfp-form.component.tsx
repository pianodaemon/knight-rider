import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, Field } from 'formik';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, ObservationSFP } from '../state/observations-sfp.reducer';
import { Catalog as AuditCatalog } from '../state/audits.reducer';
import { HistoryTable } from './history-table.component';

type Props = {
  createObservationAction: Function,
  readObservationSFPAction: Function,
  updateObservationAction: Function,
  catalog: Catalog | null,
  auditsCatalog: AuditCatalog | null,
  observation: any | null,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: '38px',
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.down('sm')]: {
        minWidth: '100%',
        display: 'flex',
      },
    },
    fieldset: {
      borderRadius: 3,
      borderWidth: 0,
      borderColor: '#DDD',
      borderStyle: 'solid',
      margin: '20px 0px',
    },
    containerLegend: {
      display: 'block',
      top: '-30px',
      position: 'relative',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      width: '128px',
      margin: '0px auto',
      textAlign: 'center',
      background: 'transparent',
      [theme.breakpoints.down('sm')]: {
        margin: '0 auto',
        width: 'auto !important',
      },
    },
    legend: {
      fontWeight: "bolder",
      color: "#128aba",
      fontSize: '1rem',
      background: '#FFF',
    },
    textErrorHelper: { color: theme.palette.error.light, maxWidth: 350, },
    submitInput: {
      backgroundColor: '#FFFFFF',
      color: '#008aba',
      border: '1px solid #008aba',
      '&:hover': {
        background: '#008aba',
        color: '#FFF',
      },
    },
    hrDivider: {
      borderTop: 0,
      height: '1px',
      /* background: 'linear-gradient(to right,transparent,#dedede,transparent)', */
      background: 'linear-gradient(to right,transparent,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,transparent)',
      width: '100%',
      border: 0,
      margin: 0,
      padding: 0,
      display: 'block',
      unicodeBidi: 'isolate',
      marginBlockStart: '0.5em',
      marginBlockEnd: '0.5em',
      marginInlineStart: 'auto',
      marginInlineEnd: 'auto',
      overflow: 'hidden',
      marginTop: '27px',
    },
    hrSpacer: {
      height: '25px',
      border: 'none',
    },
    select: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'pre'
    },
  })
);

export const ObservationsSFPForm = (props: Props) => {
  const {
    auditsCatalog,
    catalog,
    createObservationAction,
    observation,
    updateObservationAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  /*
  const initialValues = {
    observation_type_id: '',
    social_program_id: '',
    audit_id: '',
    fiscal_id: '',
    observation_code_id: '',
    observation_bis_code_id: '',
    division_id: '',
    title: '',
    amount_observed: '',
    projected: '',
    solved: '',
    comments: '',
    doc_a: '',
    doc_b: '',
    doc_c: '',
    doc_a_date: null,
    doc_b_date: null,
    doc_c_date: null,
    dep_response: '',
    dep_resp_comments: '',
    reception_date: null,
    expiration_date: null,
    hdr_doc: '',
    hdr_reception_date: null,
    hdr_expiration1_date: null,
    hdr_expiration2_date: null,
  };
  */
  const initialValues = {
    id: '',
    direccion_id: '',
    dependencia_id: '',
    fecha_captura: null,
    programa_social_id: '',
    auditoria_id: '',
    acta_cierre: '',
    fecha_firma_acta_cierre: null,
    fecha_compromiso: null,
    clave_observacion_id: '',
    observacion: '',
    acciones_correctivas: '',
    acciones_preventivas: '',
    tipo_observacion_id: '',
    monto_observado: '',
    monto_a_reintegrar: '',
    monto_reintegrado: '',
    fecha_reintegro: null,
    monto_por_reintegrar: '',
    num_oficio_of_vista_cytg: '',
    fecha_oficio_of_vista_cytg: null,
    num_oficio_cytg_aut_invest: '',
    fecha_oficio_cytg_aut_invest: null,
    num_carpeta_investigacion: '',
    num_oficio_vai_municipio: '',
    fecha_oficio_vai_municipio: null,
    autoridad_invest_id: '',
    num_oficio_pras_of: '',
    fecha_oficio_pras_of: null,
    num_oficio_pras_cytg_dependencia: '',
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp_dependencia: null,
  };
  useEffect(() => {
    if (id) {
      props.readObservationSFPAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const auditYear: any = catalog && catalog.audits && values.audit_id && catalog.audits.find(item => item.id === values.audit_id) ? (catalog.audits.find(item => item.id === values.audit_id) || {}).year : '';
    const dateFields: Array<string> = [
      'doc_a_date',
      'doc_b_date',
      'doc_c_date',
      'reception_date',
      'expiration_date',
      'hdr_reception_date',
      'hdr_expiration1_date',
      'hdr_expiration2_date',
    ];
    const noMandatoryFields: Array<string> = [
      'comments',
      'doc_a',
      'doc_b',
      'doc_c',
      'dep_response',
      'dep_resp_comments',
      'observation_bis_code_id',
      'doc_a_date',
      'reception_date',
      'expiration_date',
      'hdr_reception_date',
      'hdr_expiration1_date',
      'hdr_expiration2_date',
    ];
    // Mandatory fields (not empty)
    Object.keys(initialValues).filter(field => !noMandatoryFields.includes(field)).forEach((field: string) => {
      if (!values[field] || values[field] instanceof Date) {
        errors[field] = 'Required';

        if (dateFields.includes(field)) {
          errors[field] = 'Ingrese una fecha válida';
        }
      }
    });
    // Fechas (año en específico) de la observación no pueden ser menores al año de la auditoría
    dateFields.forEach(field => {
      if (values[field] instanceof Date ||
        (values[field] && new Date(values[field].replace(/-/g, '/')).getFullYear() < auditYear)
      ) {
        errors[field] = errors[field] || 'Revise que el año de la fecha que ingresó sea posterior al Año de la Auditoría';
      }
    });

    // Las fechas de recibido y vencimiento no pueden ser menores a la fecha registro
    ['hdr_reception_date', 'hdr_expiration1_date'].forEach(field => {
      const registerDate: number = values.hdr_expiration2_date ? new Date(values.hdr_expiration2_date.replace(/-/g, '/')).getTime() : 0;
      const fieldDate: number = values[field] ? new Date(values[field].replace(/-/g, '/')).getTime() : 0;
      if (!errors[field] && fieldDate < registerDate) {
        const type: any = {"hdr_reception_date": "Recibido", "hdr_expiration1_date": "Vencimiento"};
        errors[field] = errors[field] || `La fecha de ${type[field]} no puede ser menor a la de Registro.`;
      }
    });

    ['expiration_date', 'reception_date'].forEach(field => {
      const registerDate: number = values.doc_a_date ? new Date(values.doc_a_date.replace(/-/g, '/')).getTime() : 0;
      const fieldDate: number = values[field] && !(values[field] instanceof Date) ? new Date(values[field].replace(/-/g, '/')).getTime() : 0;
      if (!errors[field] && fieldDate < registerDate) {
        const type: any = {"expiration_date": "Vencimiento", "reception_date": "Recibido"};
        errors[field] = errors[field] || `La fecha de ${type[field]} no puede ser menor a la de Registro.`;
      }
    });

    // Other Custom Validations
    if (values.comments === '' && (observation?.projected.toString() !== values.projected || observation?.solved.toString() !== values.solved)) {
      errors.comments = 'Required';
    }

    return errors;
  };
  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={id ? observation || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = values;
          if (id) {
            delete fields.id;
            updateObservationAction({ id, fields, history, releaseForm });
          } else {
            createObservationAction({ fields, history, releaseForm });
          }
        }}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>Observaciones SFP</h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="audit_date"
                        label="Año de la cuenta pública"
                        value={catalog && catalog.audits && values.audit_id && catalog.audits.find(item => item.id === values.audit_id) ? (catalog.audits.find(item => item.id === values.audit_id) || {}).year : ''}
                        variant="filled"
                        disabled
                        InputProps={{
                          readOnly: true,
                        }} 
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="dependency"
                        label="Dependencia"
                        value={
                          catalog &&
                          auditsCatalog &&
                          catalog.audits &&
                          values.audit_id &&
                          auditsCatalog.dependencies && 
                          catalog.audits.find(item => item.id === values.audit_id)
                          // eslint-disable-next-line
                          ? auditsCatalog.dependencies.find(dependency => dependency.id === ((catalog && catalog.audits && catalog.audits.find(item => item.id === values.audit_id) || {}).dependency_id))?.title
                          : '<N/A>'
                        }
                        variant="filled"
                        disabled
                        InputProps={{
                          readOnly: true,
                        }} 
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Dirección
                      </InputLabel>
                      <Select
                        labelId="division-id"
                        id="division-id-select"
                        value={catalog ? values.division_id || '' : ''}
                        onChange={handleChange('division_id')}
                      >
                        {catalog &&
                            catalog.divisions &&
                            catalog.divisions.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.division_id &&
                        touched.division_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese una Dirección
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="fiscal">Órgano Fiscalizador</InputLabel>
                      <Select
                        labelId="fiscal"
                        id="fiscal-select"
                        value={catalog ? values.fiscal_id || '' : ''}
                        onChange={handleChange('fiscal_id')}
                      >
                        {catalog &&
                            catalog.fiscals &&
                            catalog.fiscals.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.fiscal_id &&
                          touched.fiscal_id &&
                          errors.fiscal_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un Órgano Fiscalizador
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Captura"
                        name="fecha_captura"
                      />
                      {errors.fecha_captura &&
                        touched.fecha_captura && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_captura}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="social-program-id">Programa</InputLabel>
                      <Select
                        labelId="social-program-id"
                        id="social-program-id-select"
                        value={catalog ? values.social_program_id || '' : ''}
                        onChange={handleChange('social_program_id')}
                      >
                        {catalog &&
                            catalog.social_programs &&
                            catalog.social_programs.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.social_program_id &&
                          touched.social_program_id &&
                          errors.social_program_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Elige un programa
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="audit">Auditor&iacute;a no.</InputLabel>
                      <Select
                        labelId="audit"
                        id="audit-select"
                        value={values.audit_id || ''}
                        onChange={handleChange('audit_id')}
                      >
                        {catalog &&
                          catalog.audits &&
                          catalog.audits.map((item) => {
                            return (
                              <MenuItem
                                value={item.id}
                                key={`type-${item.id}`}
                              >
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.audit_id &&
                        touched.audit_id &&
                        errors.audit_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione una Auditoría
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="acta_cierre"
                        label="Acta de Cierre o Equivalente"
                        value={values.acta_cierre || ''}
                        onChange={handleChange('acta_cierre')}
                      />
                      {errors.acta_cierre &&
                        touched.acta_cierre && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un Acta de Cierre o Equivalente
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha firma de acta"
                        name="fecha_firma_acta_cierre"
                      />
                      {errors.fecha_firma_acta_cierre &&
                        touched.fecha_firma_acta_cierre && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_firma_acta_cierre}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha Compromiso"
                        name="fecha_compromiso"
                      />
                      {errors.fecha_compromiso &&
                        touched.fecha_compromiso && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_compromiso}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        # o Clave Observación
                      </InputLabel>
                      <Select
                        labelId="clave_observacion_id"
                        id="clave_observacion_id-select"
                        value={catalog ? values.clave_observacion_id || '' : ''}
                        onChange={handleChange('clave_observacion_id')}
                      >
                        {catalog &&
                            catalog.observation_codes &&
                            catalog.observation_codes.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.clave_observacion_id &&
                        touched.clave_observacion_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione un # o Clave Observación
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="observacion"
                        label="Observación"
                        value={values.observacion || ''}
                        multiline
                        rows={3}
                        rowsMax={3}
                        onChange={handleChange('observacion')}
                      />
                      {errors.observacion && touched.observacion && errors.observacion && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una observación
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="acciones_correctivas"
                        label="Acciones Correctivas"
                        value={values.acciones_correctivas || ''}
                        onChange={handleChange('acciones_correctivas')}
                      />
                      {errors.acciones_correctivas && touched.acciones_correctivas && errors.acciones_correctivas && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese Acciones Correctivas
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="acciones_preventivas"
                        label="Acciones Preventivas"
                        value={values.acciones_preventivas || ''}
                        onChange={handleChange('acciones_preventivas')}
                      />
                      {errors.acciones_preventivas && touched.acciones_preventivas && errors.acciones_preventivas && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese Acciones Preventivas
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="tipo_observacion_id">
                        Tipo de observación
                      </InputLabel>
                      <Select
                        labelId="tipo_observacion_id"
                        id="tipo_observacion_id-select"
                        value={catalog ? values.tipo_observacion_id || '' : ''}
                        onChange={handleChange('tipo_observacion_id')}
                      >
                        {catalog &&
                            catalog.observation_types &&
                            catalog.observation_types.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.tipo_observacion_id &&
                          touched.tipo_observacion_id &&
                          errors.tipo_observacion_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un tipo de Observación
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  {/* No. Seguimiento */}















                  





                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="hdr_doc"
                        label="Oficio No."
                        value={values.hdr_doc || ''}
                        onChange={handleChange('hdr_doc')}
                      />
                      {errors.hdr_doc &&
                        touched.hdr_doc && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un No. de Oficio
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Registro (Fecha)"
                        name="hdr_expiration2_date"
                        defaultValue="2099-12-31"
                      />
                      {errors.hdr_expiration2_date &&
                        touched.hdr_expiration2_date && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.hdr_expiration2_date}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Recibido (Fecha)"
                        name="hdr_reception_date"
                      />
                      {errors.hdr_reception_date &&
                        touched.hdr_reception_date && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.hdr_reception_date}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Clave Observación
                      </InputLabel>
                      <Select
                        labelId="observation_code_id"
                        id="observation_code_id-select"
                        value={catalog ? values.observation_code_id || '' : ''}
                        onChange={handleChange('observation_code_id')}
                      >
                        {catalog &&
                            catalog.observation_codes &&
                            catalog.observation_codes.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.observation_code_id &&
                          touched.observation_code_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione una clave de observación
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Vence (Fecha)"
                        name="hdr_expiration1_date"
                      />
                      {errors.hdr_expiration1_date &&
                        touched.hdr_expiration1_date && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.hdr_expiration1_date}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="observation-type">
                        Tipo de observación
                      </InputLabel>
                      <Select
                        labelId="observation-type"
                        id="observation-type-select"
                        value={catalog ? values.observation_type_id || '' : ''}
                        onChange={handleChange('observation_type_id')}
                      >
                        {catalog &&
                            catalog.observation_types &&
                            catalog.observation_types.map((item) => {
                              return (
                                <MenuItem
                                  value={item.id}
                                  key={`type-${item.id}`}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                      </Select>
                      {errors.observation_type_id &&
                          touched.observation_type_id &&
                          errors.observation_type_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un tipo de Auditoría
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  {/*
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="title"
                        label="Descripción"
                        value={values.title || ''}
                        onChange={handleChange('title')}
                      />
                      {errors.title && touched.title && errors.title && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una descripción
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  */}
                </Grid>
                {/* </fieldset> */}

                <hr className={classes.hrSpacer} />
                <hr className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend}>
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      {/* <Icon> attach_money </Icon> */}
                      CyTG
                    </Typography>
                  </legend>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="doc_a"
                          label="Oficio No."
                          value={values.doc_a || ''}
                          onChange={handleChange('doc_a')}
                        />
                        {errors.doc_a &&
                          touched.doc_a && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese un No. de Oficio
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel>
                          Clave Observación
                        </InputLabel>
                        <Select
                          labelId="observation_bis_code_id"
                          id="observation_bis_code_id-select"
                          value={catalog ? values.observation_bis_code_id || '' : ''}
                          onChange={handleChange('observation_bis_code_id')}
                        >
                          {catalog &&
                              catalog.observation_codes &&
                              catalog.observation_codes.map((item) => {
                                return (
                                  <MenuItem
                                    value={item.id}
                                    key={`type-${item.id}`}
                                  >
                                    {item.title}
                                  </MenuItem>
                                );
                              })}
                        </Select>
                        {errors.observation_bis_code_id &&
                          touched.observation_bis_code_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione una clave de observación
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <Field
                          component={FormikDatePicker}
                          label="Fecha de Oficio"
                          name="doc_a_date"
                        />
                        {errors.doc_a_date &&
                          touched.doc_a_date && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              {errors.doc_a_date}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <Field
                          component={FormikDatePicker}
                          label="Recibido"
                          name="reception_date"
                        />
                        {errors.reception_date &&
                          touched.reception_date && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              {errors.reception_date}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <Field
                          component={FormikDatePicker}
                          label="Vencimiento"
                          name="expiration_date"
                        />
                        {errors.expiration_date &&
                          touched.expiration_date && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              {errors.expiration_date}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </fieldset>

                <hr className={classes.hrSpacer} />
                <hr className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend} style={{ width: '335px', }}>
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      {/* <Icon> attach_money </Icon> */}
                      RESPUESTA DE LA DEPENDENCIA
                    </Typography>
                  </legend>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="doc_b"
                          label="Oficio No."
                          value={values.doc_b || ''}
                          onChange={handleChange('doc_b')}
                        />
                        {errors.doc_b &&
                          touched.doc_b && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese un No. de Oficio
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="dep_response"
                          label="Respuesta"
                          multiline
                          rows={3}
                          rowsMax={3}
                          value={values.dep_response || ''}
                          onChange={handleChange('dep_response')}
                        />
                        {errors.dep_response &&
                          touched.dep_response && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese una respuesta
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <Field
                          component={FormikDatePicker}
                          label="Fecha de Oficio"
                          name="doc_b_date"
                        />
                        {errors.doc_b_date &&
                          touched.doc_b_date && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              {errors.doc_b_date}
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="dep_resp_comments"
                          label="Comentario"
                          multiline
                          rows={3}
                          rowsMax={3}
                          value={values.dep_resp_comments || ''}
                          onChange={handleChange('dep_resp_comments')}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </fieldset>

                <hr className={classes.hrSpacer} />
                <hr className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend} style={{ width: '335px', }}>
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      {/* <Icon> attach_money </Icon> */}
                      ÓRGANO FISCALIZADOR
                    </Typography>
                  </legend>
                  <Grid container spacing={3}>         
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="doc_c"
                          label="Oficio No."
                          value={values.doc_c || ''}
                          onChange={handleChange('doc_c')}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <Field
                          component={FormikDatePicker}
                          label="Fecha de Oficio"
                          name="doc_c_date"
                        />
                        {errors.doc_c_date &&
                            touched.doc_c_date && (
                              <FormHelperText
                                error
                                classes={{ error: classes.textErrorHelper }}
                              >
                                {errors.doc_c_date}
                              </FormHelperText>
                            )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </fieldset>

                <hr className={classes.hrSpacer} />
                <hr className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend}>
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      {/* <Icon> attach_money </Icon> */}
                      MONTOS
                    </Typography>
                  </legend>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Observado"
                          value={values.amount_observed}
                          onChange={handleChange('amount_observed')}
                          name="amount_observed"
                          id="amount_observed"
                          placeholder="0"
                          InputProps={{
                            inputComponent: NumberFormatCustom as any,
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        {errors.amount_observed &&
                          touched.amount_observed &&
                          errors.amount_observed && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese Monto Observado
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Proyectado"
                          value={values.projected}
                          onChange={handleChange('projected')}
                          name="projected"
                          id="projected"
                          placeholder="0"
                          InputProps={{
                            inputComponent: NumberFormatCustom as any,
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        {errors.projected &&
                          touched.projected &&
                          errors.projected && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese Monto Proyectado
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Solventado"
                          value={values.solved}
                          onChange={handleChange('solved')}
                          name="solved"
                          id="solved"
                          placeholder="0"
                          InputProps={{
                            inputComponent: NumberFormatCustom as any,
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                        />
                        {errors.solved &&
                          touched.solved &&
                          errors.solved && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Ingrese Monto Solventado
                            </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="comments"
                          label="Comentarios"
                          value={values.comments || ''}
                          onChange={handleChange('comments')}
                          multiline
                          rows={3}
                          rowsMax={3}
                        />
                        {errors.comments && touched.comments && errors.comments && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese comentarios
                        </FormHelperText>
                          )}
                      </FormControl>
                    </Grid>
                  </Grid>
                  {id &&
                  <HistoryTable history={(observation && observation.mutatedAmounts) || []} />}
                </fieldset>
                <Button
                  variant="contained"
                  className={classes.submitInput}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {!id ? 'Crear' : 'Actualizar'}
                </Button>
              </form>
            </MuiPickersUtilsProvider>
          );
        }}
      </Formik>
    </Paper>
  );
};
