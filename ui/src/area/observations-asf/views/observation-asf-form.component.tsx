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
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, /* ObservationSFP */ } from '../state/observations-asf.reducer';

type Props = {
  createObservationASFAction: Function,
  readObservationASFAction: Function,
  updateObservationASFAction: Function,
  catalog: Catalog | null,
  observation: any | null,
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  })
);

export const ObservationsASFForm = (props: Props) => {
  const {
    catalog,
    createObservationASFAction,
    observation,
    updateObservationASFAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const initialValues = {
    id: '',
    direccion_id: '',
    fecha_captura: null,
    programa_social_id: '',
    auditoria_id: '',
    num_oficio_of: '',
    fecha_recibido: null,
    fecha_vencimiento_of: null,
    num_observacion: '',
    observacion: '',
    monto_observado: '',
    num_oficio_cytg: '',
    fecha_oficio_cytg: null,
    fecha_recibido_dependencia: null,
    fecha_vencimiento: null,
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp_dependencia: null,
    resp_dependencia: '',
    comentarios: '',
    clasif_final_cytg: '',
    num_oficio_org_fiscalizador: '',
    fecha_oficio_org_fiscalizador: null,
    estatus_criterio_int_id: '',
    proyecciones: [],
  };
  useEffect(() => {
    if (id) {
      props.readObservationASFAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> = fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ["id",];

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
    if (!values.proyecciones.length) {
      errors.proyecciones = 'Required';
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
        initialValues={id ? observation || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = {...values, monto_observado: parseFloat(values.monto_observado) };
          if (id) {
            delete fields.id;
            updateObservationASFAction({ id, fields, history, releaseForm });
          } else {
            createObservationASFAction({ fields, history, releaseForm });
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
              <h1 style={{ color: '#128aba' }}>Observaciones Preliminares ASF</h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit}>
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
                      <TextField
                        id="num_oficio_of"
                        label="# de Oficio del OF"
                        value={values.num_oficio_of || ''}
                        onChange={handleChange('num_oficio_of')}
                      />
                      {errors.num_oficio_of &&
                        touched.num_oficio_of && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese # de Oficio del OF
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
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="# de Observación"
                        name="num_observacion"
                        onChange={(value: any) => {
                          return setFieldValue('num_observacion', value);
                        }}
                        options={
                        catalog && catalog.observation_codes
                          ? catalog.observation_codes
                          : []
                        }
                        value={catalog ? values.num_observacion || '' : ''}
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
                        id="num_oficio_cytg"
                        label="# de Oficio CyTG u OIC"
                        value={values.num_oficio_cytg || ''}
                        onChange={handleChange('num_oficio_cytg')}
                        InputLabelProps={{ shrink: true }}
                      />
                      {errors.num_oficio_cytg &&
                        touched.num_oficio_cytg && (
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
                        name="fecha_oficio_cytg"
                        id="fecha_oficio_cytg"
                      />
                      {errors.fecha_oficio_cytg &&
                        touched.fecha_oficio_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            {errors.fecha_oficio_cytg}
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
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de la dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
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
                        name="fecha_oficio_resp_dependencia"
                        id="fecha_oficio_resp_dependencia"
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
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="resp_dependencia"
                        label="Respuesta de la dependencia"
                        value={values.resp_dependencia || ''}
                        onChange={handleChange('resp_dependencia')}
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
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="comentarios"
                        label="Comentarios"
                        value={values.comentarios || ''}
                        multiline
                        rows={5}
                        rowsMax={5}
                        onChange={handleChange('comentarios')}
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
                        fieldValue="id"
                        label="Clasificación final CyTG"
                        name="clasif_final_cytg"
                        onChange={(value: any) => {
                          return setFieldValue('clasif_final_cytg', value);
                        }}
                        options={
                        catalog && catalog.observation_codes
                          ? catalog.observation_codes
                          : []
                        }
                        value={catalog ? values.clasif_final_cytg || '' : ''}
                      />
                      {errors.clasif_final_cytg &&
                        touched.clasif_final_cytg && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione una Clasificación final CyTG
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
                      <InputLabel id="estatus_criterio_int_id">
                        Estatus
                      </InputLabel>
                      <Select
                        labelId="estatus_criterio_int_id"
                        id="estatus_criterio_int_id-select"
                        value={catalog ? values.estatus_criterio_int_id || '' : ''}
                        onChange={handleChange('estatus_criterio_int_id')}
                      >
                        {catalog &&
                            catalog.estatus_pre_asf &&
                            catalog.estatus_pre_asf.map((item) => {
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
                      {errors.estatus_criterio_int_id &&
                          touched.estatus_criterio_int_id &&
                          errors.estatus_criterio_int_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un Estatus
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="proyecciones-mutiple-chip-label">Proyecciones</InputLabel>
                      <Select
                        labelId="proyecciones-mutiple-chip-label"
                        id="proyecciones"
                        multiple
                        value={values.proyecciones}
                        onChange={handleChange('proyecciones')}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {(selected as number[]).map((value, index) => (
                              <Chip
                                key={`chip-${index+1}`}
                                // key={catalog?.estatus_pre_asf?.find(item => item.id === value)?.id}
                                label={catalog?.estatus_pre_asf?.find(item => item.id === value)?.title}
                                className={classes.chip} 
                              />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {catalog && catalog.estatus_pre_asf && catalog.estatus_pre_asf.map((name) => (
                          <MenuItem key={name.id} value={name.id}>
                            {name.title}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.proyecciones &&
                          touched.proyecciones &&
                          errors.proyecciones && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione una Proyección
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
                </Grid>
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
