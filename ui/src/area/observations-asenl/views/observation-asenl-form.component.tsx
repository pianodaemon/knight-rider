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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import mxLocale from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { SingleTextResponsiveModal } from 'src/shared/components/modal/single-text-responsive-modal.component';
import { Catalog, ObservationASENL } from '../state/observations-asenl.reducer';

type Props = {
  createObservationASENLAction: Function,
  readObservationASENLAction: Function,
  updateObservationASENLAction: Function,
  catalog: Catalog | null,
  observation: ObservationASENL | null,
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
  })
);

export const ObservationsASENLForm = (props: Props) => {
  const {
    catalog,
    createObservationASENLAction,
    observation,
    updateObservationASENLAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { action, id } = useParams<any>();
  const fechaCaptura = new Date();
  const initialValues = {
    id: '',
    direccion_id: '',
    compartida_observacion: '',
    compartida_tipo_observacion_id: '',
    compartida_monto: '',
    fecha_captura: `${fechaCaptura.getFullYear()}-${
      fechaCaptura.getMonth() + 1
    }-${fechaCaptura.getDate()}`,
    programa_social_id: '',
    tipo_auditoria_id: '',
    auditoria_id: '',
    num_oficio_notif_obs_prelim: '',
    fecha_recibido: null,
    fecha_vencimiento_of: null,
    tipo_observacion_id: '',
    num_observacion: '',
    observacion: '',
    monto_observado: '',
    num_oficio_cytg_oic: '',
    fecha_oficio_cytg_oic: null,
    fecha_recibido_dependencia: null,
    fecha_vencimiento_cytg: null,
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp: null,
    resp_dependencia: '',
    comentarios: '',
    clasif_final_cytg: '',
    num_oficio_org_fiscalizador: '',
    fecha_oficio_org_fiscalizador: null,
    estatus_proceso_id: '',
    proyeccion_solventacion_id: '',
    resultado_final_pub_id: '',
  };
  useEffect(() => {
    if (id) {
      props.readObservationASENLAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> =
      fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ['id'];

    // Mandatory fields (not empty)
    fields
      .filter((field) => !noMandatoryFields.includes(field))
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
          if (id) {
            delete fields.id;
            updateObservationASENLAction({ id, fields, history, releaseForm });
          } else {
            createObservationASENLAction({ fields, history, releaseForm });
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
                    (item) => item.id === values.auditoria_id
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
                    (item) => item.id === values.auditoria_id
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
                  ? (
                      catalog.dependencies.find(
                        (item) => item.id === dependency
                      ) || {}
                    ).title
                  : ''
              )
              .join(', ');
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>
                Observaciones Preliminares ASENL
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
                        value={catalog && catalog.divisions ? values.direccion_id || '' : ''}
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
                        value={catalog && catalog.auditoria_tipos ? values.tipo_auditoria_id || '' : ''}
                        onChange={handleChange('tipo_auditoria_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                          catalog.auditoria_tipos &&
                          catalog.auditoria_tipos.map((item) => {
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
                        value={catalog && catalog.audits ? values.auditoria_id || '' : ''}
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
                      <TextField
                        id="compartida_observacion"
                        label="Observación (compartida)"
                        value={values.compartida_observacion || ''}
                        onChange={handleChange('compartida_observacion')}
                        disabled={disabledModeOn}
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
                      <InputLabel>Tipo de Observación (compartida)</InputLabel>
                      <Select
                        labelId="compartida_tipo_observacion_id"
                        id="compartida_tipo_observacion_id-select"
                        value={catalog && catalog.observation_types ? values.compartida_tipo_observacion_id || '' : ''}
                        onChange={handleChange('compartida_tipo_observacion_id')}
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
                      {errors.compartida_tipo_observacion_id && touched.compartida_tipo_observacion_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese un Tipo de Observación (compartida)
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto observado (compartida)"
                        value={values.compartida_monto}
                        onChange={handleChange('compartida_monto')}
                        name="compartida_monto"
                        id="compartida_monto"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        disabled={disabledModeOn}
                      />
                      {errors.compartida_monto &&
                        touched.compartida_monto &&
                        errors.compartida_monto && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Monto observado (compartida)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_notif_obs_prelim"
                        label="Num. de Oficio donde notifican Observación Preliminar"
                        value={values.num_oficio_notif_obs_prelim || ''}
                        onChange={handleChange('num_oficio_notif_obs_prelim')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_notif_obs_prelim &&
                        touched.num_oficio_notif_obs_prelim && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Num. de Oficio donde notifican Observación Preliminar
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha recibido (Acuse)"
                        name="fecha_recibido"
                        id="fecha_recibido"
                        disabled={disabledModeOn}
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
                        label="Fecha de vencimiento (OF)"
                        name="fecha_vencimiento_of"
                        id="fecha_vencimiento_of"
                        disabled={disabledModeOn}
                      />
                      {errors.fecha_vencimiento_of &&
                        touched.fecha_vencimiento_of && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_vencimiento_of}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Tipo de Observación (PROYECCION)</InputLabel>
                      <Select
                        labelId="tipo_observacion_id"
                        id="tipo_observacion_id-select"
                        value={catalog && catalog.observation_types ? values.tipo_observacion_id || '' : ''}
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
                      {errors.tipo_observacion_id && touched.tipo_observacion_id && (
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
                        label="# de Observación"
                        value={values.num_observacion || ''}
                        onChange={handleChange('num_observacion')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_observacion &&
                        touched.num_observacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione un # o Clave Observación
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
                                onClick={() => setModalField({...modalField, open: true, field: "Observación", text: values.observacion })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
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
                        id="num_oficio_cytg_oic"
                        label="# de Oficio CyTG u OIC"
                        value={values.num_oficio_cytg_oic || ''}
                        onChange={handleChange('num_oficio_cytg_oic')}
                        InputLabelProps={{ shrink: true }}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_cytg_oic &&
                        touched.num_oficio_cytg_oic && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio CyTG u OIC
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio CyTG"
                        name="fecha_oficio_cytg_oic"
                        id="fecha_oficio_cytg_oic"
                        disabled={disabledModeOn}
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
                        label="Fecha de recibido de la dependencia (Acuse)"
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
                        label="Fecha de vencimiento"
                        name="fecha_vencimiento_cytg"
                        id="fecha_vencimiento_cytg"
                        disabled={disabledModeOn}
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
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de la dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_resp_dependencia &&
                        touched.num_oficio_resp_dependencia && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un # de Oficio de respuesta de la dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio de respuesta"
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
                        onChange={handleChange('resp_dependencia')}
                        multiline
                        rows={5}
                        rowsMax={5}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() => setModalField({...modalField, open: true, field: "Respuesta de la dependencia", text: values.resp_dependencia })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
                      />
                      {errors.resp_dependencia && touched.resp_dependencia && errors.resp_dependencia && (
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
                                onClick={() => setModalField({...modalField, open: true, field: "Comentarios", text: values.comentarios })}
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={disabledModeOn}
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
                        fieldLabel="title"
                        fieldValue="sorting_val"
                        label="Clasificación final CyTG (PROYECCION)"
                        name="clasif_final_cytg"
                        onChange={(value: any) => {
                          return setFieldValue('clasif_final_cytg', value);
                        }}
                        options={
                          catalog && catalog.clasifs_internas_cytg
                            ? (catalog.clasifs_internas_cytg.find((item: any) => item.direccion_id === values.direccion_id) || {}).clasifs_internas_pairs || []
                            : []
                        }
                        value={catalog && catalog.clasifs_internas_cytg ? values.clasif_final_cytg || '' : ''}
                        disabled={disabledModeOn}
                      />
                      {errors.clasif_final_cytg &&
                        touched.clasif_final_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione una Clasificación final CyTG (PROYECCION)
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="num_oficio_org_fiscalizador"
                        label="# de Oficio para Órgano Fiscalizador"
                        value={values.num_oficio_org_fiscalizador || ''}
                        onChange={handleChange('num_oficio_org_fiscalizador')}
                        InputLabelProps={{ shrink: true }}
                        disabled={disabledModeOn}
                      />
                      {errors.num_oficio_org_fiscalizador &&
                        touched.num_oficio_org_fiscalizador && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio para Órgano Fiscalizador
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        component={FormikDatePicker}
                        label="Fecha de Oficio para Órgano Fiscalizador"
                        name="fecha_oficio_org_fiscalizador"
                        id="fecha_oficio_org_fiscalizador"
                        disabled={disabledModeOn}
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
                      <InputLabel id="estatus_proceso_id">
                        Estatus de proceso (PROYECCION)
                      </InputLabel>
                      <Select
                        labelId="estatus_proceso_id"
                        id="estatus_proceso_id-select"
                        value={catalog && catalog.estatus_pre_asenl ? values.estatus_proceso_id || '' : ''}
                        onChange={handleChange('estatus_proceso_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                            catalog.estatus_pre_asenl &&
                            catalog.estatus_pre_asenl.map((item) => {
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
                      {errors.estatus_proceso_id &&
                          touched.estatus_proceso_id &&
                          errors.estatus_proceso_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un Estatus de proceso (PROYECCION)
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Proyección Solventación</InputLabel>
                      <Select
                        labelId="proyeccion_solventacion_id"
                        id="proyeccion_solventacion_id-select"
                        value={catalog && catalog.proyecciones_asenl ? values.proyeccion_solventacion_id || '' : ''}
                        onChange={handleChange('proyeccion_solventacion_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                          catalog.proyecciones_asenl &&
                          catalog.proyecciones_asenl.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.proyeccion_solventacion_id && touched.proyeccion_solventacion_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese una Proyección Solventación
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Resultado final publicado</InputLabel>
                      <Select
                        labelId="resultado_final_pub_id"
                        id="resultado_final_pub_id-select"
                        value={catalog && catalog.proyecciones_asenl ? values.resultado_final_pub_id || '' : ''}
                        onChange={handleChange('resultado_final_pub_id')}
                        disabled={disabledModeOn}
                      >
                        {catalog &&
                          catalog.proyecciones_asenl &&
                          catalog.proyecciones_asenl.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.resultado_final_pub_id && touched.resultado_final_pub_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese un Resultado final publicado
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
