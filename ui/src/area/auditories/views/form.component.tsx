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
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component'
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, ObservationRequest } from '../state/observations.reducer';
import { HistoryTable } from './history-table.component';

type Props = {
  createObservationAction: Function,
  readObservationAction: Function,
  updateObservationAction: Function,
  catalog: Catalog | null,
  observation: ObservationRequest | null,
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
    },
    legend: {
      fontWeight: "bolder",
      color: "#128aba",
      fontSize: '1rem',
      background: '#FFF',
    },
    textErrorHelper: { color: theme.palette.error.light },
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
    }
  })
);

export const ObservationsForm = (props: Props) => {
  const {
    catalog,
    createObservationAction,
    observation,
    updateObservationAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const initialValues = {
    observation_type_id: '',
    social_program_id: '',
    audit_id: '',
    fiscal_id: '',
    observation_code_id: '',
    observation_bis_code_id: '',
    title: '',
    amount_observed: '',
    projected: '',
    solved: '',
    comments: '',
    doc_a_date: null,
    reception_date: null,
    expiration_date: null,
  };
  useEffect(() => {
    if (id) {
      props.readObservationAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={id ? observation || initialValues : initialValues}
        validate={(values: any) => {
          const errors: any = {};
          if (!values.observation_type_id) {
            errors.observation_type_id = 'Required';
          }

          if (!values.social_program_id) {
            errors.social_program_id = 'Required';
          }

          if (!values.audit_id) {
            errors.audit_id = 'Required';
          }

          if (!values.fiscal_id) {
            errors.fiscal_id = 'Required';
          }

          if (!values.title) {
            errors.title = 'Required';
          }

          if (!values.amount_observed) {
            errors.amount_observed = 'Required';
          }

          if (!values.projected) {
            errors.projected = 'Required';
          }

          if (!values.solved) {
            errors.solved = 'Required';
          }
          if (values.comments === '' && (observation?.projected.toString() !== values.projected || observation?.solved.toString() !== values.solved)) {
            errors.comments = 'Required';
          }
          if (!values.doc_a_date) {
            errors.doc_a_date = 'Required';
          }
          if (!values.reception_date) {
            errors.reception_date = 'Required';
          }
          return errors;
        }}
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
          // handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>Observaciones Preliminares</h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/*  Empty input  */}
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
                  {/*  End Empty input  */}

                  {/*  Empty input  */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Oficio No."
                        name="inputEmpty2"
                        id="inputEmpty2"
                      />
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}

                  {/*  Empty input */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Dirección
                      </InputLabel>
                      <Select
                        id="inputEmpty3"
                      >
                        <MenuItem value='1' key='1'> Algo1 </MenuItem>
                        <MenuItem value='2' key='2'> Algo2 </MenuItem>
                        <MenuItem value='3' key='3'> Algo33 </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}

                  {/*  Empty input */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Recibido (Fecha)"
                        name="inputEmpty4"
                        id="inputEmpty4"
                      />
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}
                  
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

                  {/*  Empty input */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Vence (Fecha)"
                        name="inputEmpty5"
                        id="inputEmpty5"
                      />
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}

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
                    </FormControl>
                  </Grid>
                  
                  {/*  Empty input */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Vence (Fecha)"
                        name="inputEmpty7"
                        id="inputEmpty7"
                      />
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}

                  {/*  Empty input */}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        label="Observación"
                        name="inputEmpty8"
                        id="inputEmpty8"
                      />
                    </FormControl>
                  </Grid>
                  {/* End Empty input */}

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
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="fiscal">Auditor</InputLabel>
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
                              Seleccione una Auditor
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
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
                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Oficio No."
                          name="adfa"
                          id="idalgaooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}

                    {/*  Empty input */}
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
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}

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
                              Ingrese una fecha de oficio
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
                              Ingrese una fecha de recibido
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
                              Ingrese una fecha de vencimiento
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
                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Oficio No."
                          name="adfa"
                          id="idalgaooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}

                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Respuesta"
                          name="adfa"
                          id="idasslgooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}

                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Fecha de Oficio"
                          name="adfa"
                          id="idalga"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}

                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Comentario"
                          name="adfa"
                          id="idalgaooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}
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
                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Oficio No."
                          name="adfa"
                          id="idalgaooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}
       
                    {/*  Empty input */}
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          label="Fecha Oficio"
                          name="adfa"
                          id="idasslgooo"
                        />
                      </FormControl>
                    </Grid>
                    {/* End Empty input */}
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
                          name="amount_observed"
                          id="amount_observed"
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
                  <HistoryTable history={(observation && observation.mutatedAmounts) || []} />
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
