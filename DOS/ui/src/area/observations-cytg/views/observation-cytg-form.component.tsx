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
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import mxLocale from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { SingleTextResponsiveModal } from 'src/shared/components/modal/single-text-responsive-modal.component';
import { Catalog, ObservationCYTG } from '../state/observations-cytg.reducer';

type Props = {
  createObservationCYTGAction: Function,
  readObservationCYTGAction: Function,
  updateObservationCYTGAction: Function,
  catalog: Catalog | null,
  observation: ObservationCYTG | null,
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
        opacity: 1,
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
      fontWeight: 'bolder',
      color: '#128aba',
      fontSize: '1rem',
      background: '#FFF',
    },
    textErrorHelper: { color: theme.palette.error.light, maxWidth: 350 },
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
      background:
        'linear-gradient(to right,transparent,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,transparent)',
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
      whiteSpace: 'pre',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }),
);

export const ObservationsCYTGForm = (props: Props) => {
  const {
    catalog,
    createObservationCYTGAction,
    observation,
    updateObservationCYTGAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { action, id } = useParams<any>();
  const fechaCaptura = new Date();
  const initialValues = {
    id: '',
    periodo_revision_de: null,
    periodo_revision_a: null,
    direccion_id: '',
    fecha_captura: `${fechaCaptura.getFullYear()}-${
      fechaCaptura.getMonth() + 1
    }-${fechaCaptura.getDate()}`,
    programa_social_id: '',
    auditoria_id: '',
    tipo_auditoria_id: '',
    num_oficio_inicio: '',
    fecha_notificacion_inicio: null,
    fecha_vencimiento_nombra_enlace: null,
    num_oficio_requerimiento: '',
    fecha_notificacion_requerimiento: null,
    fecha_vencimiento_requerimiento: null,
    fecha_vencimiento_nueva: null,
    tipo_observacion_id: '',
    num_observacion: '',
    observacion: '',
    monto_observado: '',
    num_oficio_cytg_oic_pre: '',
    fecha_oficio_cytg_pre: null,
    fecha_recibido_dependencia: null,
    fecha_vencimiento_pre: null,
    prorroga: false,
    num_oficio_solic_prorroga: '',
    fecha_oficio_solic_prorroga: null,
    num_oficio_contest_prorroga_cytg: '',
    fecha_oficio_contest_cytg: null,
    fecha_vencimiento_pre_nueva: null,
    clasif_pre_cytg: '',
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp: null,
    resp_dependencia: '',
    comentarios: '',
    // observacion_ires_id: '',
  };
  useEffect(() => {
    if (id) {
      props.readObservationCYTGAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> =
      fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ["id", "prorroga"];
    const mandatoryFields: Array<string> = [
      "direccion_id",
      "programa_social_id",
      "auditoria_id",
      "tipo_auditoria_id",
      "tipo_observacion_id",
      "clasif_pre_cytg",
    ];

    // Mandatory fields (not empty)
    fields
      .filter((field) => !noMandatoryFields.includes(field))
      .filter(field => mandatoryFields.includes(field))
      .forEach((field: string) => {
        if (!values[field] || values[field] instanceof Date) {
          errors[field] = 'Required';

          if (dateFields.includes(field)) {
            errors[field] = 'Ingrese una fecha válida';
          }
        }
      });
    // Fechas (año en específico) de la observación no pueden ser menores al año de la auditoría
    dateFields.forEach((field) => {
      if (
        values[field] instanceof Date
        // || (values[field] && new Date(values[field].replace(/-/g, '/')).getFullYear() < auditYear)
      ) {
        errors[field] =
          errors[field] ||
          'Revise que el año de la fecha que ingresó sea posterior al Año de la Auditoría';
      }
    });
    return errors;
  };
  const disabledModeOn = action === 'view';
  const [modalField, setModalField] = React.useState({
    field: '',
    text: '',
    open: false,
  });
  return (
    <Paper className={classes.paper}>
      <Formik
        // validateOnChange={false}
        initialValues={id ? observation || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = {
            ...values,
            monto_observado: parseFloat(values.monto_observado.toString()),
          };
          Object.keys(fields).forEach((field: any) => {
            if (fields[field] === null) {
              fields[field] = "";
            }
            if((/^fecha_/i.test(field) || /^periodo_/i.test(field)) && !fields[field]) {
              fields[field] = values.fecha_captura;
            }
            if(/^monto_/i.test(field) && !fields[field]) {
              fields[field] = 0;
            }
          });
          if (id) {
            delete fields.id;
            updateObservationCYTGAction({ id, fields, history, releaseForm });
          } else {
            createObservationCYTGAction({ fields, history, releaseForm });
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
          const years =
            catalog &&
            catalog.audits &&
            values.auditoria_id &&
            catalog.audits.find((item) => item.id === values.auditoria_id)
              ? (
                  catalog.audits.find(
                    (item) => item.id === values.auditoria_id,
                  ) || {}
                ).years?.join(', ')
              : '';
          const dependency_ids =
            catalog &&
            catalog.audits &&
            values.auditoria_id &&
            catalog.audits.find((item) => item.id === values.auditoria_id)
              ? (
                  catalog.audits.find(
                    (item) => item.id === values.auditoria_id,
                  ) || {}
                ).dependency_ids
              : '';
          const dependencias =
            catalog &&
            catalog.dependencies &&
            dependency_ids &&
            dependency_ids.length &&
            dependency_ids
              .map((dependency: any) =>
                catalog?.dependencies?.find((item) => item.id === dependency)
                  ? `${
                      (
                        catalog.dependencies.find(
                          (item) => item.id === dependency,
                        ) || {}
                      ).title
                    } - ${
                      (
                        catalog.dependencies.find(
                          (item) => item.id === dependency,
                        ) || {}
                      ).description
                    }`
                  : '',
              )
              .join(', ');
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>
                Observaciones Preliminares CyTG
              </h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit} className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="audit_date"
                        label="Año de la cuenta pública"
                        value={years || ''}
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
                      <InputLabel>Dirección</InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        labelId="direccion_id"
                        id="direccion_id-select"
                        value={
                          catalog && catalog.divisions
                            ? values.direccion_id || ''
                            : ''
                        }
                        onChange={handleChange('direccion_id')}
                      >
                        {catalog &&
                          catalog.divisions &&
                          catalog.divisions.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.direccion_id && touched.direccion_id && (
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
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Captura"
                        name="fecha_captura"
                        id="fecha_captura"
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {errors.fecha_captura && touched.fecha_captura && (
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
                      <InputLabel>Tipo de Auditoría</InputLabel>
                      <Select
                        labelId="tipo_auditoria_id"
                        id="tipo_auditoria_id-select"
                        value={
                          catalog && catalog.auditoria_tipos_cytg
                            ? values.tipo_auditoria_id || ''
                            : ''
                        }
                        onChange={handleChange('tipo_auditoria_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                          catalog.auditoria_tipos_cytg &&
                          catalog.auditoria_tipos_cytg.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.tipo_auditoria_id && touched.tipo_auditoria_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese un Tipo de Auditoría
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="No. de Auditoría"
                        name="auditoria_id"
                        onChange={(value: any) => {
                          return setFieldValue('auditoria_id', value);
                        }}
                        options={
                          catalog && catalog.audits ? catalog.audits : []
                        }
                        value={
                          catalog && catalog.audits
                            ? values.auditoria_id || ''
                            : ''
                        }
                        disabled={disabledModeOn}
                      />
                      {errors.auditoria_id && touched.auditoria_id && (
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
                        label="Periodo de revision (de)"
                        name="periodo_revision_de"
                        id="periodo_revision_de"
                        disabled={disabledModeOn}
                      />
                      {errors.periodo_revision_de &&
                        touched.periodo_revision_de && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.periodo_revision_de}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Periodo de revision (a)"
                        name="periodo_revision_a"
                        id="periodo_revision_a"
                        disabled={disabledModeOn}
                      />
                      {errors.periodo_revision_a && touched.periodo_revision_a && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          {errors.periodo_revision_a}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <AutoCompleteDropdown
                        disabled={disabledModeOn}
                        fieldLabel="title"
                        fieldValue="id"
                        label="Programa"
                        name="programa"
                        onChange={(value: any) => {
                          return setFieldValue('programa_social_id', value);
                        }}
                        options={
                          catalog &&
                          catalog.social_programs &&
                          catalog.divisions
                            ? catalog.social_programs.filter((item: any) => {
                                const direccion = (
                                  (catalog &&
                                    catalog.divisions &&
                                    catalog.divisions.find(
                                      (division: any) =>
                                        division.id === values.direccion_id,
                                    )) ||
                                  {}
                                ).title;
                                // @todo Fix me: Hardcoded values.
                                return (
                                  (item.central && direccion === 'CENTRAL') ||
                                  (item.paraestatal &&
                                    direccion === 'PARAESTATAL') ||
                                  (item.obra_pub && direccion === 'OBRAS')
                                );
                              })
                            : []
                        }
                        value={catalog ? values.programa_social_id || '' : ''}
                      />
                      <div style={{ width: 32, height: 32 }}>
                        <IconButton
                          aria-label="toggle visibility"
                          onClick={() =>
                            setModalField({
                              ...modalField,
                              open: true,
                              field: 'Programa',
                              text:
                                catalog &&
                                catalog.social_programs &&
                                values.programa_social_id &&
                                catalog.social_programs.find(
                                  (item) =>
                                    item.id === values.programa_social_id,
                                )
                                  ? (
                                      catalog.social_programs.find(
                                        (item) =>
                                          item.id === values.programa_social_id,
                                      ) || {}
                                    ).title || ''
                                  : '',
                            })
                          }
                          onMouseDown={() => {}}
                        >
                          <ZoomInIcon />
                        </IconButton>
                      </div>
                      {errors.programa_social_id && touched.programa_social_id && (
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
                      <TextField
                        id="num_oficio_inicio"
                        label="# de Oficio de Inicio"
                        value={values.num_oficio_inicio || ''}
                        onChange={handleChange('num_oficio_inicio')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_inicio && touched.num_oficio_inicio && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de Inicio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de notificación (acuse)"
                        name="fecha_notificacion_inicio"
                        id="fecha_notificacion_inicio"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_notificacion_inicio &&
                        touched.fecha_notificacion_inicio && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_notificacion_inicio}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de vencimiento (Nombramiento de enlace)"
                        name="fecha_vencimiento_nombra_enlace"
                        id="fecha_vencimiento_nombra_enlace"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_nombra_enlace &&
                        touched.fecha_vencimiento_nombra_enlace && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_nombra_enlace}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_requerimiento"
                        label="# de Oficio de requerimiento"
                        value={values.num_oficio_requerimiento || ''}
                        onChange={handleChange('num_oficio_requerimiento')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_requerimiento &&
                        touched.num_oficio_requerimiento && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio de requerimiento
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de notificación de requerimiento (acuse)"
                        name="fecha_notificacion_requerimiento"
                        id="fecha_notificacion_requerimiento"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_notificacion_requerimiento &&
                        touched.fecha_notificacion_requerimiento && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_notificacion_requerimiento}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de vencimiento (requerimiento)"
                        name="fecha_vencimiento_requerimiento"
                        id="fecha_vencimiento_requerimiento"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_requerimiento &&
                        touched.fecha_vencimiento_requerimiento && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_requerimiento}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de nuevo vencimiento"
                        name="fecha_vencimiento_nueva"
                        id="fecha_vencimiento_nueva"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_nueva &&
                        touched.fecha_vencimiento_nueva && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_nueva}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Tipo de observación preliminar</InputLabel>
                      <Select
                        labelId="tipo_observacion_id"
                        id="tipo_observacion_id-select"
                        value={
                          catalog && catalog.observation_types
                            ? values.tipo_observacion_id || ''
                            : ''
                        }
                        onChange={handleChange('tipo_observacion_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                          catalog.observation_types &&
                          catalog.observation_types.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.tipo_observacion_id &&
                        touched.tipo_observacion_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un Tipo de Observación (PROYECCION)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_observacion"
                        label="# de observación"
                        value={values.num_observacion || ''}
                        onChange={handleChange('num_observacion')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_observacion && touched.num_observacion && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de observación
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        id="observacion"
                        label="Observación"
                        value={values.observacion || ''}
                        multiline
                        rows={5}
                        rowsMax={5}
                        onChange={handleChange('observacion')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() =>
                                  setModalField({
                                    ...modalField,
                                    open: true,
                                    field: 'Observación',
                                    text: values.observacion,
                                  })
                                }
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
                      />
                      {errors.observacion &&
                        touched.observacion &&
                        errors.observacion && (
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
                        label="Monto Observado (cifra en pesos)"
                        value={values.monto_observado}
                        onChange={handleChange('monto_observado')}
                        name="monto_observado"
                        id="monto_observado"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        disabled={disabledModeOn}
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
                        id="num_oficio_cytg_oic_pre"
                        label="# de Oficio CyTG u OIC de informe preliminar"
                        value={values.num_oficio_cytg_oic_pre || ''}
                        onChange={handleChange('num_oficio_cytg_oic_pre')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_cytg_oic_pre && touched.num_oficio_cytg_oic_pre && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio CyTG u OIC de informe preliminar
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>                 
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio CyTG informe preliminar"
                        name="fecha_oficio_cytg_pre"
                        id="fecha_oficio_cytg_pre"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_oficio_cytg_pre &&
                        touched.fecha_oficio_cytg_pre && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_cytg_pre}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de recibido de la dependencia (acuse)"
                        name="fecha_recibido_dependencia"
                        id="fecha_recibido_dependencia"
                        disabled={disabledModeOn}
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
                        label="Fecha de vencimiento (preliminares)"
                        name="fecha_vencimiento_pre"
                        id="fecha_vencimiento_pre"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_pre &&
                        touched.fecha_vencimiento_pre && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_pre}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>                  
                  <Grid item xs={12} sm={6}>
                    <FormGroup row>
                      <FormControlLabel
                        disabled={disabledModeOn}
                        control={<Checkbox checked={values.prorroga} onChange={handleChange('prorroga')} name="prorroga" />}
                        label="Prórroga (Sí o No)"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_solic_prorroga"
                        label="# de Oficio de Solicitud de prórroga"
                        value={values.num_oficio_solic_prorroga || ''}
                        onChange={handleChange('num_oficio_solic_prorroga')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_solic_prorroga && touched.num_oficio_solic_prorroga && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de Solicitud de prórroga
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de Solicitud de prórroga"
                        name="fecha_oficio_solic_prorroga"
                        id="fecha_oficio_solic_prorroga"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_oficio_solic_prorroga &&
                        touched.fecha_oficio_solic_prorroga && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_solic_prorroga}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_contest_prorroga_cytg"
                        label="# de Oficio de Contestación de prórroga"
                        value={values.num_oficio_contest_prorroga_cytg || ''}
                        onChange={handleChange('num_oficio_contest_prorroga_cytg')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_contest_prorroga_cytg && touched.num_oficio_contest_prorroga_cytg && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de Contestación de prórroga
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Contestación CyTG"
                        name="fecha_oficio_contest_cytg"
                        id="fecha_oficio_contest_cytg"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_oficio_contest_cytg &&
                        touched.fecha_oficio_contest_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_contest_cytg}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de nuevo vencimiento (informe preliminar)"
                        name="fecha_vencimiento_pre_nueva"
                        id="fecha_vencimiento_pre_nueva"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_pre_nueva &&
                        touched.fecha_vencimiento_pre_nueva && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_pre_nueva}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="sorting_val"
                        label="Clasificación (preliminar) CyTG"
                        name="clasif_pre_cytg"
                        onChange={(value: any) => {
                          return setFieldValue('clasif_pre_cytg', value);
                        }}
                        options={
                          catalog && catalog.clasifs_internas_cytg
                            ? (catalog.clasifs_internas_cytg.find((item: any) => item.direccion_id === values.direccion_id) || {}).clasifs_internas_pairs || []
                            : []
                        }
                        value={catalog && catalog.clasifs_internas_cytg ? values.clasif_pre_cytg || '' : ''}
                        disabled={disabledModeOn}
                      />
                      {errors.clasif_pre_cytg &&
                        touched.clasif_pre_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione una Clasificación (preliminar) CyTG
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de la dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_resp_dependencia && touched.num_oficio_resp_dependencia && (
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
                        label="Fecha de Oficio de respuesta (acuse)"
                        name="fecha_oficio_resp"
                        id="fecha_oficio_resp"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_oficio_resp &&
                        touched.fecha_oficio_resp && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_resp}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        id="resp_dependencia"
                        label="Respuesta de la dependencia"
                        value={values.resp_dependencia || ''}
                        multiline
                        rows={5}
                        rowsMax={5}
                        onChange={handleChange('resp_dependencia')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() =>
                                  setModalField({
                                    ...modalField,
                                    open: true,
                                    field: 'Respuesta de la dependencia',
                                    text: values.resp_dependencia,
                                  })
                                }
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
                      />
                      {errors.resp_dependencia &&
                        touched.resp_dependencia &&
                        errors.resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Respuesta de la dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        id="comentarios"
                        label="Comentarios"
                        value={values.comentarios || ''}
                        multiline
                        rows={5}
                        rowsMax={5}
                        onChange={handleChange('comentarios')}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() =>
                                  setModalField({
                                    ...modalField,
                                    open: true,
                                    field: 'Comentarios',
                                    text: values.comentarios,
                                  })
                                }
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
                      />
                      {errors.comentarios &&
                        touched.comentarios &&
                        errors.comentarios && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Comentarios
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>
                {action !== 'view' && (
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
                onClose={() => setModalField({ ...modalField, open: false })}
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
