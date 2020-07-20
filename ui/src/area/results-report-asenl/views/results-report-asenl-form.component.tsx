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
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { AutoCompleteLoadMoreDropdown } from 'src/shared/components/autocomplete-load-more-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { SingleTextResponsiveModal } from 'src/shared/components/modal/single-text-responsive-modal.component';
import { Catalog, ResultsReportASENL } from '../state/results-report-asenl.reducer';

type Props = {
  createResultsReportASENLAction: Function,
  readResultsReportASENLAction: Function,
  updateResultsReportASENLAction: Function,
  loadPreObservationsASENLAction: Function,
  catalog: Catalog | null,
  report: ResultsReportASENL | null,
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
    formControlFull: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.up('xs')]: {
        minWidth: '100%',
        display: 'flex',
      },
    },
    form: {
      '& input:not([type=checkbox]):disabled, & textarea:disabled, & div[aria-disabled="true"]': {
        color: theme.palette.text.primary,
        opacity: 1
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

export const ResultsReportASENLForm = (props: Props) => {
  const {
    catalog,
    createResultsReportASENLAction,
    report,
    updateResultsReportASENLAction,
    loadPreObservationsASENLAction,
    observations,
    isLoadingPre,
    canLoadMore,
    auditId,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { action, id } = useParams<any>();
  const initialValues = {
    id: '',
    observacion_pre_id: '',
    num_oficio_of: '',
    fecha_publicacion: null,
    tipo_observacion_id: '',
    num_observacion: '',
    observacion_final: '',
    observacion_reincidente: false,
    anios_reincidencia: '',
    monto_observado: '',
    compartida_observacion: '',
    compartida_tipo_observacion_id: '',
    compartida_monto: '',
    comentarios: '',
    clasif_final_cytg: '',
    monto_solventado: '',
    monto_pendiente_solventar: '',
    monto_a_reintegrar: '',
    acciones: [],
    recomendaciones: '',
    num_oficio_recomendacion: '',
    fecha_oficio_recomendacion: null,
    fecha_vencimiento_enviar_asenl: null,
    num_oficio_dependencia: '',
    fecha_oficio_dependencia: null,
    fecha_vencimiento_interna_cytg: null,
    num_oficio_resp_dependencia: '',
    fecha_acuse_resp_dependencia: null,
    resp_dependencia: '',
    num_oficio_enviar_resp_asenl: '',
    fecha_oficio_enviar_resp_asenl: null,
    unidad_investigadora: '',
    num_vai: '',
    direccion_id: '',
    auditoria_id: '',
  };
  useEffect(() => {
    if (id) {
      props.readResultsReportASENLAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> = fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ["id","observacion_reincidente"];

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
    return errors;
  };
  const disabledModeOn = action === 'view';
  const [modalField, setModalField] = React.useState({field: '', text: '', open: false});
  return (
    <Paper className={classes.paper}>
      <Formik
        // validateOnChange={false}
        initialValues={id ? report || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = {...values };
          fields.observacion_pre_id = Array.isArray(fields.observacion_pre_id) ? fields.observacion_pre_id[0] : fields.observacion_pre_id;
          if (id) {
            delete fields.id;
            updateResultsReportASENLAction({ id, fields, history, releaseForm });
          } else {
            createResultsReportASENLAction({ fields, history, releaseForm });
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
            dependency_ids
              .map((dependency: any) =>
                catalog?.dependencies?.find((item) => item.id === dependency)
                  ? `${(
                      catalog.dependencies.find(
                        (item) => item.id === dependency
                      ) || {}
                    ).title} - ${(
                      catalog.dependencies.find(
                        (item) => item.id === dependency
                      ) || {}
                    ).description}`
                  : ''
              )
              .join(', ');
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>Observación de Resultados ASENL</h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit} className={classes.form}>
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
                        disabled={disabledModeOn}
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
                      <AutoCompleteLoadMoreDropdown
                        disabled={disabledModeOn}
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
                            : catalog && catalog.audits && (
                                catalog.audits.find((audit: any) => audit.title.toLowerCase().indexOf(value.toLowerCase()) > -1) || {}
                              ).id;
                          if (
                            auditoria_id &&
                            ((auditId !== auditoria_id) || canLoadMore)
                          ) {
                            loadPreObservationsASENLAction({
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
                        disabled={disabledModeOn}
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
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de publicación"
                        name="fecha_publicacion"
                        id="fecha_publicacion"
                      />
                      {errors.fecha_publicacion &&
                        touched.fecha_publicacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_publicacion}
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
                        disabled={disabledModeOn}
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
                        disabled={disabledModeOn}
                        id="num_observacion"
                        label="# de Observación"
                        value={values.num_observacion || ''}
                        onChange={handleChange('num_observacion')}
                      />
                      {errors.num_observacion &&
                        touched.num_observacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Observación
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="observacion_final"
                        label="Texto de la observación final (análisis)"
                        value={values.observacion_final || ''}
                        onChange={handleChange('observacion_final')}
                      />
                      {errors.observacion_final &&
                        touched.observacion_final && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Texto de la observación final (análisis)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormGroup row>
                      <FormControlLabel
                        disabled={disabledModeOn}
                        control={<Checkbox checked={values.observacion_reincidente} onChange={handleChange('observacion_reincidente')} name="observacion_reincidente" />}
                        label="Observación reincidente (Sí/No)"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="anios_reincidencia"
                        label="Años reincidencia"
                        value={values.anios_reincidencia || ''}
                        onChange={handleChange('anios_reincidencia')}
                      />
                      {errors.anios_reincidencia &&
                        touched.anios_reincidencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Años reincidencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="compartida_observacion"
                        label="Observación (compartida)"
                        value={values.compartida_observacion || ''}
                        onChange={handleChange('compartida_observacion')}
                      />
                      {errors.compartida_observacion &&
                        touched.compartida_observacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Observación (compartida)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="compartida_tipo_observacion_id">
                        Tipo de observación (compartida)
                      </InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        id="compartida_tipo_observacion_id-select"
                        labelId="compartida_tipo_observacion_id"
                        onChange={handleChange('compartida_tipo_observacion_id')}
                        value={catalog && catalog.observation_types ? values.compartida_tipo_observacion_id || '' : ''}
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
                      {errors.compartida_tipo_observacion_id &&
                          touched.compartida_tipo_observacion_id &&
                          errors.compartida_tipo_observacion_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un Tipo de observación (compartida)
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="compartida_monto"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        label="Monto (compartida)"
                        name="compartida_monto"
                        onChange={handleChange('compartida_monto')}
                        placeholder="0"
                        value={values.compartida_monto}
                      />
                      {errors.compartida_monto &&
                        touched.compartida_monto &&
                        errors.compartida_monto && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto (compartida)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        disabled={disabledModeOn}
                        id="comentarios"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() => setModalField({...modalField, open: true, field: "Comentarios", text: values.comentarios })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        label="Comentarios"
                        multiline
                        onChange={handleChange('comentarios')}
                        rows={5}
                        rowsMax={5}
                        value={values.comentarios || ''}
                      />
                      {errors.comentarios && touched.comentarios && errors.comentarios && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese comentarios
                      </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <AutoCompleteDropdown
                        disabled={disabledModeOn}
                        fieldLabel="title"
                        fieldValue="sorting_val"
                        label="Clasificación final Interna CyTG"
                        name="clasif_final_cytg"
                        onChange={(value: any) => {
                          return setFieldValue('clasif_final_cytg', value);
                        }}
                        options={
                          catalog && catalog.clasifs_internas_cytg
                            ? (catalog.clasifs_internas_cytg.find((item: any) => item.direccion_id === values.direccion_id) || {}).clasifs_internas_pairs || []
                            : []
                        }
                        value={catalog && values && values.clasif_final_cytg ? values.clasif_final_cytg : ''}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Acciones
                      </InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        id="acciones-select"
                        labelId="acciones"
                        multiple
                        value={catalog && catalog.acciones_asenl ? values.acciones || '' : ''}
                        onChange={handleChange('acciones')}
                      >
                        {catalog &&
                            catalog.acciones_asenl &&
                            catalog.acciones_asenl.map((item) => {
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
                      {errors.acciones &&
                        touched.acciones && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Acciones
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        disabled={disabledModeOn}
                        id="recomendaciones"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() => setModalField({...modalField, open: true, field: "Recomendaciones", text: values.recomendaciones })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        label="Recomendaciones"
                        multiline
                        onChange={handleChange('recomendaciones')}
                        rows={5}
                        rowsMax={5}
                        value={values.recomendaciones || ''}
                      />
                      {errors.recomendaciones && touched.recomendaciones && errors.recomendaciones && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese recomendaciones
                      </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_recomendacion"
                        label="# de Oficio de recomendación"
                        value={values.num_oficio_recomendacion || ''}
                        onChange={handleChange('num_oficio_recomendacion')}
                      />
                      {errors.num_oficio_recomendacion &&
                        touched.num_oficio_recomendacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio de recomendación
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha del Oficio de recomendación"
                        name="fecha_oficio_recomendacion"
                        id="fecha_oficio_recomendacion"
                      />
                      {errors.fecha_oficio_recomendacion &&
                        touched.fecha_oficio_recomendacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_recomendacion}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de vencimiento para enviar a ASENL"
                        name="fecha_vencimiento_enviar_asenl"
                        id="fecha_vencimiento_enviar_asenl"
                      />
                      {errors.fecha_vencimiento_enviar_asenl &&
                        touched.fecha_vencimiento_enviar_asenl && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_enviar_asenl}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_dependencia"
                        label="# de Oficio para dependencia"
                        value={values.num_oficio_dependencia || ''}
                        onChange={handleChange('num_oficio_dependencia')}
                      />
                      {errors.num_oficio_dependencia &&
                        touched.num_oficio_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio para dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de Oficio para dependencia"
                        name="fecha_oficio_dependencia"
                        id="fecha_oficio_dependencia"
                      />
                      {errors.fecha_oficio_dependencia &&
                        touched.fecha_oficio_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_dependencia}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de vencimiento interna CyTG"
                        name="fecha_vencimiento_interna_cytg"
                        id="fecha_vencimiento_interna_cytg"
                      />
                      {errors.fecha_vencimiento_interna_cytg &&
                        touched.fecha_vencimiento_interna_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_interna_cytg}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
                      />
                      {errors.num_oficio_resp_dependencia &&
                        touched.num_oficio_resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio de respuesta de dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de acuse de respuesta de dependencia"
                        name="fecha_acuse_resp_dependencia"
                        id="fecha_acuse_resp_dependencia"
                      />
                      {errors.fecha_acuse_resp_dependencia &&
                        touched.fecha_acuse_resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_acuse_resp_dependencia}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        disabled={disabledModeOn}
                        id="resp_dependencia"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() => setModalField({...modalField, open: true, field: "Respuesta de dependencia (acciones a realizar)", text: values.resp_dependencia })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        label="Respuesta de dependencia (acciones a realizar)"
                        multiline
                        onChange={handleChange('resp_dependencia')}
                        rows={5}
                        rowsMax={5}
                        value={values.resp_dependencia || ''}
                      />
                      {errors.resp_dependencia && touched.resp_dependencia && errors.resp_dependencia && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese Respuesta de dependencia (acciones a realizar)
                      </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_enviar_resp_asenl"
                        label="# de Oficio para enviar respuesta a la ASENL"
                        value={values.num_oficio_enviar_resp_asenl || ''}
                        onChange={handleChange('num_oficio_enviar_resp_asenl')}
                      />
                      {errors.num_oficio_enviar_resp_asenl &&
                        touched.num_oficio_enviar_resp_asenl && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio para enviar respuesta a la ASENL
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha del Oficio para enviar respuesta a la ASENL"
                        name="fecha_oficio_enviar_resp_asenl"
                        id="fecha_oficio_enviar_resp_asenl"
                      />
                      {errors.fecha_oficio_enviar_resp_asenl &&
                        touched.fecha_oficio_enviar_resp_asenl && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_enviar_resp_asenl}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="unidad_investigadora"
                        label="Unidad investigadora"
                        value={values.unidad_investigadora || ''}
                        onChange={handleChange('unidad_investigadora')}
                      />
                      {errors.unidad_investigadora &&
                        touched.unidad_investigadora && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Unidad investigadora
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_vai"
                        label="# VAI"
                        value={values.num_vai || ''}
                        onChange={handleChange('num_vai')}
                      />
                      {errors.num_vai &&
                        touched.num_vai && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # VAI
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
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
                        disabled={disabledModeOn}
                        label="Monto solventado"
                        value={values.monto_solventado}
                        onChange={handleChange('monto_solventado')}
                        name="monto_solventado"
                        id="monto_solventado"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                      {errors.monto_solventado &&
                        touched.monto_solventado &&
                        errors.monto_solventado && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto solventado
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        label="Monto pendiente de solventar"
                        value={values.monto_pendiente_solventar}
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
                            Ingrese Monto pendiente de solventar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
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
                </Grid>

                {action !== "view" && (
                <Button
                  variant="contained"
                  className={classes.submitInput}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {!id ? 'Crear' : 'Actualizar'}
                </Button>
                )}
              </form>
              <SingleTextResponsiveModal 
                open={modalField.open}
                onClose={() => setModalField({...modalField, open: false})}
                field={modalField.field}
                text={modalField.text}
              />
            </MuiPickersUtilsProvider>
          );
        }}
      </Formik>
    </Paper>
  );
};
