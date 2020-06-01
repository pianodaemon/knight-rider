import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, Field, FieldArray, ArrayHelpers, FastField } from 'formik';
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
import PostAddIcon from '@material-ui/icons/PostAdd';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, /* ObservationSFP */ } from '../state/observations-sfp.reducer';

type Props = {
  createObservationSFPAction: Function,
  readObservationSFPAction: Function,
  updateObservationSFPAction: Function,
  catalog: Catalog | null,
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
    paper2: {
      padding: '38px',
      marginBottom: '25px',
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
    catalog,
    createObservationSFPAction,
    observation,
    updateObservationSFPAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
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
    seguimientos: [],
    anios_cuenta_publica: '',
  };
  const seguimientoTemplate = {
    observacion_id: parseInt(id, 10) || 0,
    seguimiento_id: 0,
    num_oficio_cytg_oic: "",
    fecha_oficio_cytg_oic: null,
    fecha_recibido_dependencia: null,
    fecha_vencimiento_cytg: null,
    num_oficio_resp_dependencia: "",
    fecha_recibido_oficio_resp: null,
    resp_dependencia: "",
    comentarios: "",
    clasif_final_interna_cytg: "",
    num_oficio_org_fiscalizador: "",
    fecha_oficio_org_fiscalizador: null,
    estatus_id: "",
    monto_solventado: "",
    monto_pendiente_solventar: "",
  };
  useEffect(() => {
    if (id) {
      props.readObservationSFPAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> = fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ["id", "seguimientos", "anios_cuenta_publica"];

    // Mandatory fields (not empty)
    fields.filter(field => !noMandatoryFields.includes(field)).forEach((field: string) => {
      if (!values[field] || values[field] instanceof Date) {
        errors[field] = 'Required';

        if (dateFields.includes(field)) {
          errors[field] = 'Ingrese una fecha válida';
        }
      }
    });
    // Fechas (año en específico) de la observación no pueden ser menores al año de la auditoría
    dateFields.forEach(field => {
      if (values[field] instanceof Date
        // || (values[field] && new Date(values[field].replace(/-/g, '/')).getFullYear() < auditYear)
      ) {
        errors[field] = errors[field] || 'Revise que el año de la fecha que ingresó sea posterior al Año de la Auditoría';
      }
    });
    /* @todo use scroll to view
    const element = document.getElementById(Object.keys(errors)[0]);
    if (element) {
      console.log(element);
      // @todo Replace this for a useRef hook. Since this is a functional component, we cannot use componentWillRecieveProps (and since it's also, deprecated)
      // https://stackoverflow.com/questions/45077004/react-using-refs-to-scrollintoview-doent-work-on-componentdidupdate#comment109689911_52860557
      setTimeout(() => element.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}), 0);
    }
    */
    return errors;
  };
  return (
    <Paper className={classes.paper}>
      <Formik
        // validateOnChange={false}
        initialValues={id ? observation || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = values;
          const anio_auditoria = catalog && catalog.audits && values.auditoria_id && catalog.audits.find((item) => item.id === values.auditoria_id) ? (catalog.audits.find((item) => item.id === values.auditoria_id) || {}).year : '';
          fields.anios_cuenta_publica = [anio_auditoria];
          fields.seguimientos = fields.seguimientos.map((item: any, index: number) => { 
            return { ...item, seguimiento_id: index };
          });
          if (id) {
            delete fields.id;
            updateObservationSFPAction({ id, fields, history, releaseForm });
          } else {
            createObservationSFPAction({ fields, history, releaseForm });
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
          setFieldValue,
        }) => {
          const anio_auditoria = catalog && catalog.audits && values.auditoria_id && catalog.audits.find((item) => item.id === values.auditoria_id) ? (catalog.audits.find((item) => item.id === values.auditoria_id) || {}).year : '';
          const dependencia = catalog && catalog.dependencies && values.dependencia_id && catalog.dependencies.find((item) => item.id === parseInt(values.dependencia_id, 10)) ? (catalog.dependencies.find((item) => item.id === parseInt(values.dependencia_id, 10)) || {}).title : '';
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
                        value={anio_auditoria || ''}
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
                        id="dependencia_id"
                        label="Dependencia"
                        value={dependencia || ''}
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
                        labelId="direccion_id"
                        id="direccion_id-select"
                        value={catalog ? values.direccion_id || '' : ''}
                        onChange={handleChange('direccion_id')}
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
                      {errors.direccion_id &&
                        touched.direccion_id && (
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
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="Programa"
                        name="programa"
                        onChange={(value: any) => {
                          return setFieldValue('programa_social_id', value);
                        }}
                        options={
                          catalog && catalog.social_programs
                            ? catalog.social_programs
                            : []
                        }
                        value={catalog ? values.programa_social_id || '' : ''}
                      />
                      {errors.programa_social_id &&
                        touched.programa_social_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un Programa
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="Auditoría"
                        name="auditoria_id"
                        onChange={(value: any) => {
                          return setFieldValue('auditoria_id', value);
                        }}
                        options={
                        catalog && catalog.audits
                          ? catalog.audits
                          : []
                      }
                        value={catalog ? values.auditoria_id || '' : ''}
                      />
                      {errors.auditoria_id &&
                        touched.auditoria_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese una Auditoría
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
                        id="fecha_captura"
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
                      <TextField
                        id="observacion"
                        label="Observación"
                        value={values.observacion || ''}
                        multiline
                        rows={5}
                        rowsMax={5}
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
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="# o Clave de Observación"
                        name="clave_observacion_id"
                        onChange={(value: any) => {
                          return setFieldValue('clave_observacion_id', value);
                        }}
                        options={
                        catalog && catalog.observation_codes
                          ? catalog.observation_codes
                          : []
                        }
                        value={catalog ? values.clave_observacion_id || '' : ''}
                      />
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
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto Observado"
                        value={values.monto_observado}
                        onChange={handleChange('monto_observado')}
                        name="monto_observado"
                        id="monto_observado"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      {errors.monto_observado &&
                        touched.monto_observado &&
                        errors.monto_observado && (
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
                        label="Monto a Reintegrar"
                        value={values.monto_a_reintegrar}
                        onChange={handleChange('monto_a_reintegrar')}
                        name="monto_a_reintegrar"
                        id="monto_a_reintegrar"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      {errors.monto_a_reintegrar &&
                        touched.monto_a_reintegrar &&
                        errors.monto_a_reintegrar && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto a Reintegrar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto Reintegrado"
                        value={values.monto_reintegrado}
                        onChange={handleChange('monto_reintegrado')}
                        name="monto_reintegrado"
                        id="monto_reintegrado"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      {errors.monto_reintegrado &&
                        touched.monto_reintegrado &&
                        errors.monto_reintegrado && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto Reintegrado
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha Reintegro"
                        name="fecha_reintegro"
                      />
                      {errors.fecha_reintegro &&
                        touched.fecha_reintegro && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_reintegro}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto por Reintegrar"
                        value={values.monto_por_reintegrar}
                        onChange={handleChange('monto_por_reintegrar')}
                        name="monto_por_reintegrar"
                        id="monto_por_reintegrar"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      {errors.monto_por_reintegrar &&
                        touched.monto_por_reintegrar &&
                        errors.monto_por_reintegrar && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto por Reintegrar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_of_vista_cytg"
                        label="# de oficio del OF que da vista a la CyTG"
                        value={values.num_oficio_of_vista_cytg || ''}
                        onChange={handleChange('num_oficio_of_vista_cytg')}
                      />
                      {errors.num_oficio_of_vista_cytg &&
                        touched.num_oficio_of_vista_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de oficio del OF que da vista a la CyTG
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha oficio"
                        name="fecha_oficio_of_vista_cytg"
                      />
                      {errors.fecha_oficio_of_vista_cytg &&
                        touched.fecha_oficio_of_vista_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_of_vista_cytg}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_cytg_aut_invest"
                        label="# de oficio de la CyTG para la Aut. Investigadora"
                        value={values.num_oficio_cytg_aut_invest || ''}
                        onChange={handleChange('num_oficio_cytg_aut_invest')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.num_oficio_cytg_aut_invest &&
                        touched.num_oficio_cytg_aut_invest && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de oficio de la CyTG para la Aut. Investigadora
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha oficio"
                        name="fecha_oficio_cytg_aut_invest"
                      />
                      {errors.fecha_oficio_cytg_aut_invest &&
                        touched.fecha_oficio_cytg_aut_invest && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_cytg_aut_invest}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_carpeta_investigacion"
                        label="# de Carpeta de Invest."
                        value={values.num_carpeta_investigacion || ''}
                        onChange={handleChange('num_carpeta_investigacion')}
                      />
                      {errors.num_carpeta_investigacion &&
                        touched.num_carpeta_investigacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Carpeta de Invest.
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_vai_municipio"
                        label="# de Oficio VAI a Municipio"
                        value={values.num_oficio_vai_municipio || ''}
                        onChange={handleChange('num_oficio_vai_municipio')}
                      />
                      {errors.num_oficio_vai_municipio &&
                        touched.num_oficio_vai_municipio && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio VAI a Municipio
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha oficio"
                        name="fecha_oficio_vai_municipio"
                      />
                      {errors.fecha_oficio_vai_municipio &&
                        touched.fecha_oficio_vai_municipio && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_vai_municipio}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Autoridad Investigadora
                      </InputLabel>
                      <Select
                        labelId="autoridad_invest_id"
                        id="autoridad_invest_id-select"
                        value={catalog ? values.autoridad_invest_id || '' : ''}
                        onChange={handleChange('autoridad_invest_id')}
                      >
                        {catalog &&
                            catalog.autoridades_invest &&
                            catalog.autoridades_invest.map((item) => {
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
                      {errors.autoridad_invest_id &&
                        touched.autoridad_invest_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Autoridad Investigadora
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_pras_of"
                        label="# de Oficio de PRAS DEL OF"
                        value={values.num_oficio_pras_of || ''}
                        onChange={handleChange('num_oficio_pras_of')}
                      />
                      {errors.num_oficio_pras_of &&
                        touched.num_oficio_pras_of && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio de PRAS DEL OF
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha oficio"
                        name="fecha_oficio_pras_of"
                      />
                      {errors.fecha_oficio_pras_of &&
                        touched.fecha_oficio_pras_of && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_pras_of}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_pras_cytg_dependencia"
                        label="# de Oficio PRAS DE LA CyTG PARA LA DEPENDENCIA"
                        value={values.num_oficio_pras_cytg_dependencia || ''}
                        onChange={handleChange('num_oficio_pras_cytg_dependencia')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.num_oficio_pras_cytg_dependencia &&
                        touched.num_oficio_pras_cytg_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio PRAS DE LA CyTG PARA LA DEPENDENCIA
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_resp_dependencia"
                        label="# Oficio de respuesta de la dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
                      />
                      {errors.num_oficio_resp_dependencia &&
                        touched.num_oficio_resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # Oficio de respuesta de la dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha oficio"
                        name="fecha_oficio_resp_dependencia"
                      />
                      {errors.fecha_oficio_resp_dependencia &&
                        touched.fecha_oficio_resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_resp_dependencia}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>

                <hr className={classes.hrSpacer} />
                <hr className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend}>
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      Seguimientos
                    </Typography>
                  </legend>
                  
                  <FieldArray
                    name="seguimientos"
                    validateOnChange={false}
                    render={(arrayHelpers: ArrayHelpers) => (
                      <>
                        <div style={{ padding: '0px 10px', textAlign: 'left', marginBottom: '10px' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<PostAddIcon />}
                            size="medium"
                            onClick={() => arrayHelpers.push(seguimientoTemplate)}
                          >
                            Agregar Seguimiento
                          </Button>
                        </div>
                        {values && values.seguimientos && values.seguimientos.map((seguimiento: any, index: number) => (
                          <Paper className={classes.paper2} elevation={4} key={`fields-group-${index+1}`}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>                            
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  startIcon={<DeleteForeverIcon />}
                                  size="medium"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  Remover Seguimiento
                                </Button>
                              </Grid>
                              <Grid item xs={12} sm={6} />
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    id="seguimiento_id"
                                    label="No. Seguimiento"
                                    disabled
                                    // onChange={(value: any) => setFieldValue(`seguimientos.${index}`, value.target.value)} 
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].seguimiento_id : ''} 
                                    variant="filled"
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    // id="num_oficio_cytg_oic"
                                    label="# Oficio CyTG u OIC"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_cytg_oic`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_cytg_oic : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    // id="fecha_oficio_cytg_oic"
                                    label="Fecha de Oficio CyTG"
                                    name={`seguimientos.${index}.fecha_oficio_cytg_oic`}
                                  />
                                  {errors.fecha_oficio_cytg_oic &&
                              touched.fecha_oficio_cytg_oic && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_oficio_cytg_oic}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    // id="fecha_recibido_dependencia"
                                    label="Fecha de Recibido de la dependencia (ACUSE)"
                                    name={`seguimientos.${index}.fecha_recibido_dependencia`}
                                  />
                                  {errors.fecha_recibido_dependencia &&
                              touched.fecha_recibido_dependencia && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_recibido_dependencia}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    // id="fecha_vencimiento_cytg"
                                    label="Fecha de vencimiento CyTG"
                                    name={`seguimientos.${index}.fecha_vencimiento_cytg`}
                                  />
                                  {errors.fecha_vencimiento_cytg &&
                              touched.fecha_vencimiento_cytg && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_vencimiento_cytg}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField
                                    // id="num_oficio_resp_dependencia"
                                    label="# De Oficio de respuesta dependencia"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_resp_dependencia`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_resp_dependencia : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    label="Fecha de recibido del oficio de respuesta"
                                    name={`seguimientos.${index}.fecha_recibido_oficio_resp`}
                                    // value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].fecha_recibido_oficio_resp : ''}
                                  />
                                  {errors.fecha_recibido_oficio_resp &&
                              touched.fecha_recibido_oficio_resp && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_recibido_oficio_resp}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    // id="resp_dependencia"
                                    label="Respuesta de la dependencia"
                                    // name={`seguimientos.${index}.resp_dependencia`}
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.resp_dependencia`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].resp_dependencia : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <FastField
                                    component={TextField}
                                    // id="comentarios-seguimiento"
                                    label="Comentarios"
                                    multiline
                                    name={`seguimientos.${index}.comentarios`}
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.comentarios`, value.target.value)}
                                    rows={5}
                                    rowsMax={5}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].comentarios : ''}
                                  />
                                  {errors.comentarios && touched.comentarios && errors.comentarios && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    Ingrese un Comentario
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <AutoCompleteDropdown
                                    fieldLabel="title"
                                    fieldValue="id"
                                    label="Clasificación final Interna CyTG"
                                    name="clasif_final_interna_cytg"
                                    onChange={(value: any) => {
                                      return setFieldValue(`seguimientos.${index}.clasif_final_interna_cytg`, value);
                                    }}
                                    options={
                                      catalog && catalog.observation_codes
                                        ? catalog.observation_codes
                                        : []
                                    }
                                    value={catalog && values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].clasif_final_interna_cytg : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    // id="num_oficio_org_fiscalizador"
                                    label="# Oficio para Organo fiscalizador"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_org_fiscalizador`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_org_fiscalizador : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    label="Fecha del Oficio para Órgano fiscalizador"
                                    name={`seguimientos.${index}.fecha_oficio_org_fiscalizador`}
                                    // value={seguimiento.fecha_oficio_org_fiscalizador}
                                  />
                                  {errors.fecha_oficio_org_fiscalizador &&
                              touched.fecha_oficio_org_fiscalizador && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_oficio_org_fiscalizador}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  {/* <TextField id="estatus_id" label="Estatus" value={seguimiento.estatus_id} /> */}

                                  <InputLabel>
                                    Estatus
                                  </InputLabel>
                                  <Select
                                    labelId="estatus_id"
                                    // id="estatus_id-select"
                                    onChange={handleChange(`seguimientos.${index}.estatus_id`)}
                                    value={catalog && values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].estatus_id : ''}
                                  >
                                    {catalog &&
                                        catalog.estatus_sfp &&
                                        catalog.estatus_sfp.map((item) => {
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
                                  {errors.estatus_id &&
                                    touched.estatus_id && (
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
                                  <TextField
                                    label="Monto Solventado"
                                    // onChange={handleChange('monto_solventado')}
                                    // name="monto_solventado"
                                    // id="monto_solventado"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.monto_solventado`, value.target.value)}
                                    placeholder="0"
                                    InputProps={{
                                      inputComponent: NumberFormatCustom as any,
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].monto_solventado : ''}
                                  />
                                  {errors.monto_solventado &&
                                  touched.monto_solventado &&
                                  errors.monto_solventado && (
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
                                    label="Monto Pendiente de solventar"
                                    // onChange={handleChange('monto_pendiente_solventar')}
                                    // name="monto_pendiente_solventar"
                                    // id="monto_pendiente_solventar"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.monto_pendiente_solventar`, value.target.value)}
                                    placeholder="0"
                                    InputProps={{
                                      inputComponent: NumberFormatCustom as any,
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].monto_pendiente_solventar : ''}
                                  />
                                  {errors.monto_pendiente_solventar &&
                                  touched.monto_pendiente_solventar &&
                                  errors.monto_pendiente_solventar && (
                                    <FormHelperText
                                      error
                                      classes={{ error: classes.textErrorHelper }}
                                    >
                                      Ingrese Monto Pendiente de solventar
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </>
                    )}
                  />
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
