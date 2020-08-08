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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import mxLocale from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { AutoCompleteLoadMoreDropdown } from 'src/shared/components/autocomplete-load-more-dropdown.component';
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { SingleTextResponsiveModal } from 'src/shared/components/modal/single-text-responsive-modal.component';
import { sub } from 'src/shared/math/add.util';
import {
  Catalog,
  ResultsReportCYTG,
} from '../state/results-report-cytg.reducer';

type Props = {
  createResultsReportCYTGAction: Function,
  readResultsReportCYTGAction: Function,
  updateResultsReportCYTGAction: Function,
  loadPreObservationsCYTGAction: Function,
  catalog: Catalog | null,
  report: ResultsReportCYTG | null,
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
  }),
);

export const ResultsReportCYTGForm = (props: Props) => {
  const {
    catalog,
    createResultsReportCYTGAction,
    report,
    updateResultsReportCYTGAction,
    loadPreObservationsCYTGAction,
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
    num_observacion: '',
    observacion: '',
    tipo_observacion_id: '',
    estatus_info_resultados_id: '',
    acciones_preventivas: '',
    acciones_correctivas: '',
    clasif_final_cytg: '',
    monto_solventado: '',
    monto_pendiente_solventar: '',
    monto_a_reintegrar: '',
    monto_reintegrado: '',
    fecha_reintegro: null,
    monto_por_reintegrar: '',
    num_oficio_cytg_aut_invest: '',
    fecha_oficio_cytg_aut_invest: null,
    num_carpeta_investigacion: '',
    num_oficio_vai_municipio: '',
    fecha_oficio_vai_municipio: null,
    num_oficio_pras_cytg_dependencia: '',
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp_dependencia: null,
    seguimientos: [],
    direccion_id: '',
    auditoria_id: '',
    programa_social_id: '',
  };
  const seguimientoTemplate = {
    observacion_id: '',
    seguimiento_id: '',
    num_oficio_ires: '',
    fecha_notif_ires: null,
    fecha_vencimiento_ires: null,
    prorroga: false,
    num_oficio_solic_prorroga: '',
    fecha_oficio_solic_prorroga: null,
    num_oficio_contest_prorroga: '',
    fecha_oficio_contest: null,
    fecha_vencimiento_ires_nueva: null,
    num_oficio_resp_dependencia: '',
    fecha_oficio_resp_dependencia: null,
    resp_dependencia: '',
    comentarios: '',
    estatus_seguimiento_id: '',
    monto_solventado: '',
    monto_pendiente_solventar: '',
  };
  useEffect(() => {
    if (id) {
      props.readResultsReportCYTGAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const dateFields: Array<string> =
      fields.filter((item: string) => /^fecha_/i.test(item)) || [];
    const noMandatoryFields: Array<string> = ['id','monto_por_reintegrar'];

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
        if (
          field === 'observacion_pre_id' &&
          Array.isArray(values[field]) &&
          !values[field].length
        ) {
          errors[field] = 'Required';
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
        initialValues={id ? report || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = { ...values };
          fields.observacion_pre_id = Array.isArray(fields.observacion_pre_id)
            ? fields.observacion_pre_id[0]
            : fields.observacion_pre_id;
          if (id) {
            delete fields.id;
            updateResultsReportCYTGAction({ id, fields, history, releaseForm });
          } else {
            createResultsReportCYTGAction({ fields, history, releaseForm });
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
                Observación de Resultados CyTG
              </h1>
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
                      <InputLabel>Dirección</InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        id="direccion_id-select"
                        labelId="direccion_id"
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
                          catalog && catalog.audits ? catalog.audits : []
                        }
                        value={catalog ? values.auditoria_id || '' : ''}
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
                  <Grid item xs={12}>
                    <FormControl className={classes.formControlFull}>
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
                              programa_social_id,
                            } =
                              (observations &&
                                observations.find(
                                  (item: any) => item.id === value[0],
                                )) ||
                              {};
                            setFieldValue('auditoria_id', auditoria_id);
                            setFieldValue('direccion_id', direccion_id);
                            setFieldValue(
                              'programa_social_id',
                              programa_social_id,
                            );
                          }
                          return setFieldValue('observacion_pre_id', value);
                        }}
                        options={observations || []}
                        value={(() => {
                          const observacion_pre_id = values.observacion_pre_id
                            ? [values.observacion_pre_id]
                            : [];
                          return observations &&
                            values.observacion_pre_id &&
                            Array.isArray(values.observacion_pre_id)
                            ? [...values.observacion_pre_id]
                            : observacion_pre_id;
                        })()}
                        onSearch={(value: any) => {
                          const str = value.match(/^\b(id:)([0-9]+)\b$/i);
                          const auditoria_id = str
                            ? parseInt(str[2], 10)
                            : catalog &&
                              catalog.audits &&
                              (
                                catalog.audits.find(
                                  (audit: any) =>
                                    audit.title
                                      .toLowerCase()
                                      .indexOf(value.toLowerCase()) > -1,
                                ) || {}
                              ).id;
                          if (
                            auditoria_id &&
                            (auditId !== auditoria_id || canLoadMore)
                          ) {
                            loadPreObservationsCYTGAction({
                              auditoria_id,
                              loadMore: true,
                              observacion_pre_id: Array.isArray(
                                values.observacion_pre_id,
                              )
                                ? values.observacion_pre_id[0]
                                : values.observacion_pre_id,
                            });
                          }
                        }}
                        loading={isLoadingPre}
                      />
                      {errors.observacion_pre_id && touched.observacion_pre_id && (
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
                      <AutoCompleteDropdown
                        disabled
                        fieldLabel="title"
                        fieldValue="id"
                        label="Programa / Rubro"
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
                        disabled={disabledModeOn}
                        id="num_observacion"
                        label="# de Observación"
                        value={values.num_observacion || ''}
                        onChange={handleChange('num_observacion')}
                      />
                      {errors.num_observacion && touched.num_observacion && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Observación
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        disabled={disabledModeOn}
                        id="observacion"
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
                        label="Observación"
                        multiline
                        onChange={handleChange('observacion')}
                        rows={5}
                        rowsMax={5}
                        value={values.observacion || ''}
                      />
                      {errors.observacion &&
                        touched.observacion &&
                        errors.observacion && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Observación
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
                        value={
                          catalog && catalog.observation_types
                            ? values.tipo_observacion_id || ''
                            : ''
                        }
                        onChange={handleChange('tipo_observacion_id')}
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
                      <InputLabel id="estatus_info_resultados_id">
                        Estatus informe de resultados
                      </InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        labelId="estatus_info_resultados_id"
                        id="estatus_info_resultados_id-select"
                        value={
                          catalog && catalog.estatus_ires_cytg
                            ? values.estatus_info_resultados_id || ''
                            : ''
                        }
                        onChange={handleChange('estatus_info_resultados_id')}
                      >
                        {catalog &&
                          catalog.estatus_ires_cytg &&
                          catalog.estatus_ires_cytg.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.estatus_info_resultados_id &&
                        touched.estatus_info_resultados_id &&
                        errors.estatus_info_resultados_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Seleccione un Estatus informe de resultados
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        id="acciones_preventivas"
                        label="Acciones Preventivas"
                        value={values.acciones_preventivas || ''}
                        onChange={handleChange('acciones_preventivas')}
                        multiline
                        rows={5}
                        rowsMax={5}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() =>
                                  setModalField({
                                    ...modalField,
                                    open: true,
                                    field: 'Acciones Preventivas',
                                    text: values.acciones_preventivas,
                                  })
                                }
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={action === 'view'}
                      />
                      {errors.acciones_preventivas &&
                        touched.acciones_preventivas &&
                        errors.acciones_preventivas && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Acciones Preventivas
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControlFull}>
                      <TextField
                        id="acciones_correctivas"
                        label="Acciones Correctivas"
                        value={values.acciones_correctivas || ''}
                        onChange={handleChange('acciones_correctivas')}
                        multiline
                        rows={5}
                        rowsMax={5}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle visibility"
                                onClick={() =>
                                  setModalField({
                                    ...modalField,
                                    open: true,
                                    field: 'Acciones Correctivas',
                                    text: values.acciones_correctivas,
                                  })
                                }
                                onMouseDown={() => {}}
                              >
                                <ZoomInIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        disabled={action === 'view'}
                      />
                      {errors.acciones_correctivas &&
                        touched.acciones_correctivas &&
                        errors.acciones_correctivas && (
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
                            ? (
                                catalog.clasifs_internas_cytg.find(
                                  (item: any) =>
                                    item.direccion_id === values.direccion_id
                                ) || {}
                              ).clasifs_internas_pairs || []
                            : []
                        }
                        value={
                          catalog && values && values.clasif_final_cytg
                            ? values.clasif_final_cytg
                            : ''
                        }
                      />
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
                        id="num_oficio_vai_municipio"
                        label="# de Oficio VAI a municipio"
                        value={values.num_oficio_vai_municipio || ''}
                        onChange={handleChange('num_oficio_vai_municipio')}
                      />
                      {errors.num_oficio_vai_municipio && touched.num_oficio_vai_municipio && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio VAI a municipio
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de Oficio VAI a municipio"
                        name="fecha_oficio_vai_municipio"
                        id="fecha_oficio_vai_municipio"
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
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_pras_cytg_dependencia"
                        label="# de Oficio PRAS/PFRA de la CyTG para la Dependencia"
                        value={values.num_oficio_pras_cytg_dependencia || ''}
                        onChange={handleChange('num_oficio_pras_cytg_dependencia')}
                      />
                      {errors.num_oficio_pras_cytg_dependencia && touched.num_oficio_pras_cytg_dependencia && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio PRAS/PFRA de la CyTG para la Dependencia
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        disabled={disabledModeOn}
                        id="num_oficio_resp_dependencia"
                        label="# de Oficio de respuesta de la Dependencia"
                        value={values.num_oficio_resp_dependencia || ''}
                        onChange={handleChange('num_oficio_resp_dependencia')}
                      />
                      {errors.num_oficio_resp_dependencia && touched.num_oficio_resp_dependencia && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de respuesta de la Dependencia
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de oficio (acuse)"
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
                        {action !== 'view' && (
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
                        )}
                        {values && values.seguimientos && values.seguimientos.map((seguimiento: any, index: number) => (
                          <Paper className={classes.paper2} elevation={4} key={`fields-group-${index+1}`}>
                            <Grid container spacing={3}>
                              {action !== 'view' && (
                              <>
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
                              </>
                              )}
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
                                    disabled={disabledModeOn}
                                    // id="num_oficio_cytg_oic"
                                    label="# de Oficio del informe de resultados/cédula de seguimiento"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_ires`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_ires : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_notif_ires"
                                    label="Fecha de notificación (acuse)"
                                    name={`seguimientos.${index}.fecha_notif_ires`}
                                  />
                                  {errors.fecha_notif_ires && touched.fecha_notif_ires && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    {errors.fecha_notif_ires}
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_vencimiento_ires"
                                    label="Fecha de vencimiento (resultados/cédula)"
                                    name={`seguimientos.${index}.fecha_vencimiento_ires`}
                                  />
                                  {errors.fecha_vencimiento_ires && touched.fecha_vencimiento_ires && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    {errors.fecha_vencimiento_ires}
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
                                    disabled={disabledModeOn}
                                    // id="num_oficio_solic_prorroga"
                                    label="# de Oficio de Solicitud de prórroga"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_solic_prorroga`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_solic_prorroga : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_oficio_solic_prorroga"
                                    label="Fecha de Oficio de Solicitud de prórroga (acuse)"
                                    name={`seguimientos.${index}.fecha_oficio_solic_prorroga`}
                                  />
                                  {errors.fecha_oficio_solic_prorroga && touched.fecha_oficio_solic_prorroga && (
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
                                    disabled={disabledModeOn}
                                    // id="num_oficio_contest_prorroga"
                                    label="# de Oficio de Contestación de prórroga"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_contest_prorroga`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_contest_prorroga : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_oficio_contest"
                                    label="Fecha de Oficio de Contestación de prórroga"
                                    name={`seguimientos.${index}.fecha_oficio_contest`}
                                  />
                                  {errors.fecha_oficio_contest && touched.fecha_oficio_contest && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    {errors.fecha_oficio_contest}
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_vencimiento_ires_nueva"
                                    label="Fecha de nuevo vencimiento (informe de resultados)"
                                    name={`seguimientos.${index}.fecha_vencimiento_ires_nueva`}
                                  />
                                  {errors.fecha_vencimiento_ires_nueva && touched.fecha_vencimiento_ires_nueva && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    {errors.fecha_vencimiento_ires_nueva}
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField 
                                    disabled={disabledModeOn}
                                    // id="num_oficio_resp_dependencia"
                                    label="# de Oficio de respuesta de la Dependencia"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.num_oficio_resp_dependencia`, value.target.value)}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].num_oficio_resp_dependencia : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <Field
                                    component={FormikDatePicker}
                                    disabled={disabledModeOn}
                                    // id="fecha_oficio_resp_dependencia"
                                    label="Fecha de Oficio de respuesta de la Dependencia"
                                    name={`seguimientos.${index}.fecha_oficio_resp_dependencia`}
                                  />
                                  {errors.fecha_oficio_resp_dependencia && touched.fecha_oficio_resp_dependencia && (
                                  <FormHelperText
                                    error
                                    classes={{ error: classes.textErrorHelper }}
                                  >
                                    {errors.fecha_oficio_resp_dependencia}
                                  </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} md={6}>
                                <FormControl className={classes.formControlFull}>
                                  <TextField 
                                    disabled={disabledModeOn}
                                    // id="resp_dependencia"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <IconButton
                                            aria-label="toggle visibility"
                                            onClick={() => setModalField({...modalField, open: true, field: "Respuesta de la dependencia", text: values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].resp_dependencia : '' })}
                                            onMouseDown={() => {}}
                                          >
                                            <ZoomInIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                    label="Respuesta de la dependencia"
                                    multiline
                                    // name={`seguimientos.${index}.resp_dependencia`}
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.resp_dependencia`, value.target.value)}
                                    rows={5}
                                    rowsMax={5}
                                    value={values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].resp_dependencia : ''}
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={12} md={6}>
                                <FormControl className={classes.formControlFull}>
                                  <FastField
                                    component={TextField}
                                    disabled={disabledModeOn}
                                    // id="comentarios-seguimiento"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <IconButton
                                            aria-label="toggle visibility"
                                            onClick={() => setModalField({...modalField, open: true, field: "Comentarios", text: values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].comentarios : '' })}
                                            onMouseDown={() => {}}
                                          >
                                            <ZoomInIcon />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
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
                                  <InputLabel>
                                    Estatus
                                  </InputLabel>
                                  <Select
                                    disabled={disabledModeOn}
                                    // id="estatus_id-select"
                                    labelId="estatus_seguimiento_id"
                                    onChange={handleChange(`seguimientos.${index}.estatus_seguimiento_id`)}
                                    value={catalog && catalog.estatus_ires_cytg && values && values.seguimientos && values.seguimientos[index] ? values.seguimientos[index].estatus_seguimiento_id : ''}
                                  >
                                    {catalog &&
                                        catalog.estatus_ires_cytg &&
                                        catalog.estatus_ires_cytg.map((item) => {
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
                                        Ingrese Estatus del seguimiento
                                      </FormHelperText>
                                    )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl className={classes.formControl}>
                                  <TextField
                                    disabled={disabledModeOn}
                                    // id="monto_solventado"
                                    InputProps={{
                                      inputComponent: NumberFormatCustom as any,
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    label="Monto Solventado"
                                    // name="monto_solventado"
                                    onChange={(value: any) => setFieldValue(`seguimientos.${index}.monto_solventado`, value.target.value)}
                                    placeholder="0"
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
                                    disabled={disabledModeOn}
                                    // id="monto_pendiente_solventar"
                                    InputProps={{
                                      inputComponent: NumberFormatCustom as any,
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    label="Monto Pendiente de solventar"
                                    name="monto_pendiente_solventar"
                                    onChange={handleChange('monto_pendiente_solventar')}
                                    placeholder="0"
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
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Monto Reintegrado (miles de pesos)"
                        value={values.monto_reintegrado}
                        onChange={handleChange('monto_reintegrado')}
                        name="monto_reintegrado"
                        id="monto_reintegrado"
                        placeholder="0"
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        disabled={(action === 'view')}
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
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha del reintegro"
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
                        label="Monto por Reintegrar (miles de pesos)"
                        value={sub(values.monto_a_reintegrar || 0, values.monto_reintegrado || 0).toString() || "0"}
                        onChange={handleChange('monto_por_reintegrar')}
                        name="monto_por_reintegrar"
                        id="monto_por_reintegrar"
                        placeholder="0"
                        variant="filled"
                        disabled
                        InputProps={{
                          inputComponent: NumberFormatCustom as any,
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          readOnly: true,
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
                        disabled={disabledModeOn}
                        id="num_oficio_cytg_aut_invest"
                        label="# de Oficio de la CyTG para la Autoridad investigadora"
                        value={values.num_oficio_cytg_aut_invest || ''}
                        onChange={handleChange('num_oficio_cytg_aut_invest')}
                      />
                      {errors.num_oficio_cytg_aut_invest && touched.num_oficio_cytg_aut_invest && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de Oficio de la CyTG para la Autoridad investigadora
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <Field
                        disabled={disabledModeOn}
                        component={FormikDatePicker}
                        label="Fecha de Oficio de la CyTG para la Autoridad investigadora"
                        name="fecha_oficio_cytg_aut_invest"
                        id="fecha_oficio_cytg_aut_invest"
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
                        disabled={disabledModeOn}
                        id="num_carpeta_investigacion"
                        label="# de carpeta de investigación"
                        value={values.num_carpeta_investigacion || ''}
                        onChange={handleChange('num_carpeta_investigacion')}
                      />
                      {errors.num_carpeta_investigacion && touched.num_carpeta_investigacion && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese # de carpeta de investigación
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
