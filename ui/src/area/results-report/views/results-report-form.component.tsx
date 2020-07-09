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
import Typography from '@material-ui/core/Typography';
import PostAddIcon from '@material-ui/icons/PostAdd';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import InputAdornment from '@material-ui/core/InputAdornment';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { AutoCompleteLoadMoreDropdown } from 'src/shared/components/autocomplete-load-more-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, /* ObservationSFP */ } from '../state/results-report.reducer';

type Props = {
  createResultsReportAction: Function,
  readResultsReportAction: Function,
  updateResultsReportAction: Function,
  loadPreObservationsAction: Function,
  catalog: Catalog | null,
  report: any | null,
  observations: Array<any> | null,
  isLoadingPre: boolean,
  canLoadMore: boolean,
  auditId: number,
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

export const ResultsReportForm = (props: Props) => {
  const {
    catalog,
    createResultsReportAction,
    report,
    updateResultsReportAction,
    loadPreObservationsAction,
    observations,
    isLoadingPre,
    canLoadMore,
    auditId,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const initialValues = {
    id: '',
    observacion_pre_id: '',
    num_oficio_of: '',
    fecha_recibido: null,
    fecha_vencimiento: null,
    observacion_ir: '',
    tipo_observacion_id: '',
    accion: '',
    clave_accion: '',
    monto_observado: '',
    monto_a_reintegrar: '',
    monto_reintegrado: '',
    fecha_reintegro: null,
    monto_por_reintegrar: '',
    tiene_pras: false,
    seguimientos: [],
    pras: {},
    direccion_id: '',
    auditoria_id: '',
    programa_social_id: '',
  };
  const seguimientoTemplate = {
    observacion_id: parseInt(id, 10) || 0,
    seguimiento_id: "",
    medio_notif_seguimiento_id: "",
    num_oficio_cytg_oic: "",
    fecha_oficio_cytg_oic: null,
    fecha_recibido_dependencia: null,
    fecha_vencimiento_cytg: null,
    num_oficio_resp_dependencia:  "",
    fecha_recibido_oficio_resp: null,
    resp_dependencia:  "",
    comentarios:  "",
    clasif_final_interna_cytg: "",
    num_oficio_org_fiscalizador:  "",
    fecha_oficio_org_fiscalizador: null,
    estatus_id: "",
    monto_solventado: "",
    num_oficio_monto_solventado: "",
    fecha_oficio_monto_solventado: null,
    monto_pendiente_solventar: "",
  };
  const PRAS = {
    autoridad_invest_id: 1,
    fecha_oficio_cytg_aut_invest: '2018-05-25',
    fecha_oficio_cytg_org_fiscalizador: '2018-07-25',
    fecha_oficio_of_vista_cytg: '2018-07-22',
    fecha_oficio_pras_of: '2018-09-25',
    fecha_oficio_resp_dependencia: '2018-09-28',
    fecha_oficio_vai_municipio: '2099-12-31',
    num_carpeta_investigacion: '',
    num_oficio_cytg_aut_invest: '',
    num_oficio_cytg_org_fiscalizador: '',
    num_oficio_of_vista_cytg: '',
    num_oficio_pras_cytg_dependencia: 'CTG-DCASC-750/2018',
    num_oficio_pras_of: 'OAESII/SOL-0235/2018',
    num_oficio_resp_dependencia: 'SSP-236/2018',
    num_oficio_vai_municipio: 'NO DATO',
    pras_observacion_id: 0
  };
  useEffect(() => {
    if (id) {
      props.readResultsReportAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> = fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ["id", "seguimientos", "pras", "tiene_pras"];

    // Mandatory fields (not empty)
    fields.filter(field => !noMandatoryFields.includes(field)).forEach((field: string) => {
      if (!values[field] || values[field] instanceof Date) {
        errors[field] = 'Required';

        if (dateFields.includes(field)) {
          errors[field] = 'Ingrese una fecha válida';
        }
      }
      if (field === 'observacion_pre_id' && Array.isArray(values[field]) && !values[field].length) {
        errors[field] = 'Required';
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

    // PRAs
    if (values.tiene_pras) {
      Object.keys(values.pras).forEach((field: any) => {
        if (!values.pras[field] || values.pras[field] instanceof Date) {
          errors[`pras_${field}`] = 'Required';
  
          if (/^fecha_/i.test(field)) {
            errors[`pras_${field}`] = 'Ingrese una fecha válida';
          }
        }
      });
    }
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
        initialValues={id ? report || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = {...values };
          fields.pras.pras_observacion_id = fields.id;
          fields.seguimientos = fields.seguimientos.map((item: any, index: number) => { 
            return { ...item, seguimiento_id: index };
          });
          if (!fields.tiene_pras) {
            fields.pras = PRAS;
          }
          fields.observacion_pre_id = Array.isArray(fields.observacion_pre_id) ? fields.observacion_pre_id.pop() : fields.observacion_pre_id;
          if (id) {
            delete fields.id;
            updateResultsReportAction({ id, fields, history, releaseForm });
          } else {
            createResultsReportAction({ fields, history, releaseForm });
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
        }: any) => {
          const anio_auditoria =
            catalog &&
            catalog.audits &&
            values.auditoria_id &&
            catalog.audits.find(
              (item) => item.id === values.auditoria_id
            )
              ? (catalog.audits.find((item) => item.id === values.auditoria_id) || {}).years?.join(', ')
              : '';
          const dependency_ids = 
            catalog &&
            catalog.audits &&
            values.auditoria_id &&
            catalog.audits.find(
              (item) => item.id === values.auditoria_id
            )
              ? (catalog.audits.find((item) => item.id === values.auditoria_id) || {}).dependency_ids
              : '';
          const dependencias = 
            catalog &&
            catalog.dependencies &&
            dependency_ids &&
            dependency_ids.length &&
            dependency_ids.map(
              (dependency: any) => catalog?.dependencies?.find((item) => item.id === dependency)
                ? (catalog.dependencies.find((item) => item.id === dependency) || {}).title
                : ''
            ).join(', ');
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>Observación de Resultados ASF</h1>
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
                        value={dependencias || ''}
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
                        disabled
                        id="direccion_id-select"
                        labelId="direccion_id"
                        value={catalog && catalog.divisions ? values.direccion_id || '' : ''}
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
                        disabled
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
                        disabled
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
                      <AutoCompleteLoadMoreDropdown
                        fieldLabel="observation"
                        fieldValue="id"
                        label="Observación Preliminar"
                        name="observacion_pre_id"
                        onChange={(value: any) => {
                          if (Array.isArray(value) && value.length) {
                            const {
                              auditoria_id,
                              direccion_id,
                              programa_social_id
                            } = (observations && observations.find((item: any) => item.id === value[0])) || {};
                            setFieldValue('auditoria_id', auditoria_id);
                            setFieldValue('direccion_id', direccion_id);
                            setFieldValue('programa_social_id', programa_social_id);
                          }
                          return setFieldValue('observacion_pre_id', value);
                        }}
                        options={observations || []}
                        value={
                          (() => {
                            const observacion_pre_id = values.observacion_pre_id ? [values.observacion_pre_id] : [];
                            return observations &&
                            values.observacion_pre_id &&
                            Array.isArray(values.observacion_pre_id) 
                              ? [...values.observacion_pre_id]
                              : observacion_pre_id
                          })()
                        }
                        onSearch={(value: any) => { 
                          const str = value.match(/^\b(id:)([0-9]+)\b$/i);
                          const auditoria_id = str 
                            ? parseInt(str[2], 10)
                            : catalog && (
                                catalog.audits.find((audit: any) => audit.title.toLowerCase().indexOf(value.toLowerCase()) > -1) || {}
                              ).id;
                          if (
                            auditoria_id &&
                            ((auditId !== auditoria_id) || canLoadMore)
                          ) {
                            loadPreObservationsAction({
                              auditoria_id, loadMore: true,
                              observacion_pre_id: Array.isArray(values.observacion_pre_id)
                                ? values.observacion_pre_id[0]
                                : values.observacion_pre_id
                            });
                          } 
                        }}
                        loading={isLoadingPre}
                      />
                      {errors.observacion_pre_id &&
                        touched.observacion_pre_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione una Observación Preliminar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_of"
                        label="# de Oficio del OF (Resultados)"
                        value={values.num_oficio_of || ''}
                        onChange={handleChange('num_oficio_of')}
                      />
                      {errors.num_oficio_of &&
                        touched.num_oficio_of && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio del OF (Resultados)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de recibido"
                        name="fecha_recibido"
                        id="fecha_recibido"
                      />
                      {errors.fecha_recibido &&
                        touched.fecha_recibido && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_recibido}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de vencimiento (Org Fisc)"
                        name="fecha_vencimiento"
                        id="fecha_vencimiento"
                      />
                      {errors.fecha_vencimiento &&
                        touched.fecha_vencimiento && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="observacion_ir"
                        label="Texto de la observación"
                        value={values.observacion_ir || ''}
                        onChange={handleChange('observacion_ir')}
                      />
                      {errors.observacion_ir &&
                        touched.observacion_ir && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Texto de la observación
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
                        value={catalog && catalog.observation_types ? values.tipo_observacion_id || '' : ''}
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
                              Seleccione un Tipo de observación
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="accion"
                        label="Acción"
                        value={values.accion || ''}
                        onChange={handleChange('accion')}
                      />
                      {errors.accion &&
                        touched.accion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Acción
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="clave_accion"
                        label="Clave Acción"
                        value={values.clave_accion || ''}
                        onChange={handleChange('clave_accion')}
                      />
                      {errors.clave_accion &&
                        touched.clave_accion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Clave Acción
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
                                  <InputLabel id="medio_notif_seguimiento_id">
                                    Medio notificación de seguimiento
                                  </InputLabel>
                                  <Select
                                    labelId="medio_notif_seguimiento_id"
                                    // id="medio_notif_seguimiento_id-select"
                                    value={catalog && catalog.medios_notif_seguimiento_asf && values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].medio_notif_seguimiento_id : ''}
                                    onChange={handleChange(`seguimientos.${index}.medio_notif_seguimiento_id`)}
                                  >
                                    {catalog &&
                                        catalog.medios_notif_seguimiento_asf &&
                                        catalog.medios_notif_seguimiento_asf.map((item) => {
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
                                  {errors.medio_notif_seguimiento_id &&
                                      touched.medio_notif_seguimiento_id &&
                                      errors.medio_notif_seguimiento_id && (
                                        <FormHelperText
                                          error
                                          classes={{ error: classes.textErrorHelper }}
                                        >
                                          Seleccione un Medio notificación de seguimiento
                                        </FormHelperText>
                                      )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    // id="num_oficio_cytg_oic"
                                    label="# de Oficio CyTG u OIC"
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
                                    fieldValue="sorting_val"
                                    label="Clasificación final Interna CyTG"
                                    name="clasif_final_interna_cytg"
                                    onChange={(value: any) => {
                                      return setFieldValue(`seguimientos.${index}.clasif_final_interna_cytg`, value);
                                    }}
                                    options={
                                      catalog && catalog.clasifs_internas_cytg
                                        ? (catalog.clasifs_internas_cytg.find((item: any) => item.direccion_id === values.direccion_id) || {}).clasifs_internas_pairs || []
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
                                    value={catalog && catalog.estatus_ires_asf && values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].estatus_id : ''}
                                  >
                                    {catalog &&
                                        catalog.estatus_ires_asf &&
                                        catalog.estatus_ires_asf.map((item) => {
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
                                  <FastField
                                    component={TextField}
                                    // id="comentarios-seguimiento"
                                    label="# de Oficio (monto solventado)"
                                    name={`seguimientos.${index}.num_oficio_monto_solventado`}
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_monto_solventado`, value.target.value)}
                                    rows={5}
                                    rowsMax={5}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_monto_solventado : ''}
                                  />
                                  {errors.num_oficio_monto_solventado && touched.num_oficio_monto_solventado && errors.num_oficio_monto_solventado && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    Ingrese # de Oficio (monto solventado)
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    label="Fecha de Oficio - acuse (monto solventado)"
                                    name={`seguimientos.${index}.fecha_oficio_monto_solventado`}
                                    // value={seguimiento.fecha_oficio_monto_solventado}
                                  />
                                  {errors.fecha_oficio_monto_solventado &&
                              touched.fecha_oficio_monto_solventado && (
                                <FormHelperText
                                  error
                                  classes={{ error: classes.textErrorHelper }}
                                >
                                  {errors.fecha_oficio_monto_solventado}
                                </FormHelperText>
                              )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField
                                    label="Monto Pendiente de solventar"
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].monto_pendiente_solventar : ''}
                                    onChange={handleChange('monto_pendiente_solventar')}
                                    name="monto_pendiente_solventar"
                                    id="monto_pendiente_solventar"
                                    placeholder="0"
                                    InputProps={{
                                      inputComponent: NumberFormatCustom as any,
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
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

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto a reintegrar"
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
                            Ingrese Monto a reintegrar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto reintegrado"
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
                            Ingrese Monto reintegrado
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de reintegro"
                        name="fecha_reintegro"
                        id="fecha_reintegro"
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
                        label="Monto por reintegrar"
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
                            Ingrese Monto por reintegrar
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
                      Fin Seguimientos
                    </Typography>
                  </legend>
                </fieldset>


                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.tiene_pras}
                            onChange={handleChange('tiene_pras')}
                            name="tiene_pras"
                            color="primary"
                          />
                        }
                        label="¿Tiene PRAS?"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
                
                {values?.tiene_pras && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_of_vista_cytg"
                        label="# de Oficio del OF que da vista a la CyTG"
                        value={values.pras.num_oficio_of_vista_cytg || ''}
                        onChange={handleChange('pras.num_oficio_of_vista_cytg')}
                      />
                      {errors.pras_num_oficio_of_vista_cytg &&
                      touched.pras && touched.pras.num_oficio_of_vista_cytg && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio del OF que da vista a la CyTG
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio del OF que da vista a la CyTG"
                        name="pras.fecha_oficio_of_vista_cytg"
                        id="fecha_oficio_of_vista_cytg"
                      />
                      {errors.pras_fecha_oficio_of_vista_cytg &&
                      touched.pras && touched.pras.fecha_oficio_of_vista_cytg && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          {errors.pras_fecha_oficio_of_vista_cytg}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_cytg_aut_invest"
                        label="# de Oficio de la CyTG para la Autoridad Investigadora"
                        value={values.pras.num_oficio_cytg_aut_invest || ''}
                        onChange={handleChange('pras.num_oficio_cytg_aut_invest')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.pras_num_oficio_cytg_aut_invest &&
                      touched.pras && touched.pras.num_oficio_cytg_aut_invest && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de la CyTG para la Autoridad Investigadora
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de la CyTG para la Autoridad Investigadora"
                        name="pras.fecha_oficio_cytg_aut_invest"
                        id="fecha_oficio_cytg_aut_invest"
                      />
                      {errors.pras_fecha_oficio_cytg_aut_invest &&
                      touched.pras && touched.pras.fecha_oficio_cytg_aut_invest && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        {errors.pras_fecha_oficio_cytg_aut_invest}
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_carpeta_investigacion"
                        label="# de Carpeta de Investigación"
                        value={values.pras.num_carpeta_investigacion || ''}
                        onChange={handleChange('pras.num_carpeta_investigacion')}
                      />
                      {errors.pras_num_carpeta_investigacion &&
                      touched.pras && touched.pras.num_carpeta_investigacion && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Carpeta de Investigación
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_cytg_org_fiscalizador"
                        label="# de Oficio de la CyTG para Órgano Fiscalizador"
                        value={values.pras.num_oficio_cytg_org_fiscalizador || ''}
                        onChange={handleChange('pras.num_oficio_cytg_org_fiscalizador')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.pras_num_oficio_cytg_org_fiscalizador &&
                      touched.pras && touched.pras.num_oficio_cytg_org_fiscalizador && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de la CyTG para Órgano Fiscalizador
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de la CyTG para Órgano Fiscalizador"
                        name="pras.fecha_oficio_cytg_org_fiscalizador"
                        id="fecha_oficio_cytg_org_fiscalizador"
                      />
                      {errors.pras_fecha_oficio_cytg_org_fiscalizador &&
                      touched.pras && touched.pras.fecha_oficio_cytg_org_fiscalizador && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        {errors.pras_fecha_oficio_cytg_org_fiscalizador}
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_vai_municipio"
                        label="# de Oficio VAI a Municipio"
                        value={values.pras.num_oficio_vai_municipio || ''}
                        onChange={handleChange('pras.num_oficio_vai_municipio')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.pras_num_oficio_vai_municipio &&
                      touched.pras && touched.pras.num_oficio_vai_municipio && (
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
                        label="Fecha de Oficio VAI a Municipio"
                        name="pras.fecha_oficio_vai_municipio"
                        id="fecha_oficio_vai_municipio"
                      />
                      {errors.pras_fecha_oficio_vai_municipio &&
                      touched.pras && touched.pras.fecha_oficio_vai_municipio && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        {errors.pras_fecha_oficio_vai_municipio}
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="tipo_observacion_id">
                        Autoridad Investigadora
                      </InputLabel>
                      <Select
                        labelId="autoridad_invest_id"
                        id="autoridad_invest_id-select"
                        value={catalog && catalog.autoridades_invest ? values.pras.autoridad_invest_id || '' : ''}
                        onChange={handleChange('pras.autoridad_invest_id')}
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
                      {errors.pras_autoridad_invest_id &&
                      touched.pras && touched.pras.autoridad_invest_id && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione una Autoridad Investigadora
                      </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_pras_of"
                        label="# de Oficio de PRAS del OF"
                        value={values.pras.num_oficio_pras_of || ''}
                        onChange={handleChange('pras.num_oficio_pras_of')}
                      />
                      {errors.pras_num_oficio_pras_of &&
                      touched.pras && touched.pras.num_oficio_pras_of && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese # de Oficio de PRAS del OF
                      </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de PRAS del OF"
                        name="pras.fecha_oficio_pras_of"
                        id="fecha_oficio_pras_of"
                      />
                      {errors.pras_fecha_oficio_pras_of &&
                      touched.pras && touched.pras.fecha_oficio_pras_of && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        {errors.pras_fecha_oficio_pras_of}
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_pras_cytg_dependencia"
                        label="# de Oficio PRAS de la CyTG para la dependencia"
                        value={values.pras.num_oficio_pras_cytg_dependencia || ''}
                        onChange={handleChange('pras.num_oficio_pras_cytg_dependencia')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.pras_num_oficio_pras_cytg_dependencia &&
                      touched.pras && touched.pras.num_oficio_pras_cytg_dependencia && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese # de Oficio PRAS de la CyTG para la dependencia
                      </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de la dependencia"
                        value={values.pras.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('pras.num_oficio_resp_dependencia')}
                      />
                      {errors.pras_num_oficio_resp_dependencia &&
                      touched.pras && touched.pras.num_oficio_resp_dependencia && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese # de Oficio de respuesta de la dependencia
                      </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de respuesta de la dependencia"
                        name="pras.fecha_oficio_resp_dependencia"
                        id="fecha_oficio_resp_dependencia"
                      />
                      {errors.pras_fecha_oficio_resp_dependencia &&
                      touched.pras && touched.pras.fecha_oficio_resp_dependencia && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        {errors.pras_fecha_oficio_resp_dependencia}
                      </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>
                )}


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
