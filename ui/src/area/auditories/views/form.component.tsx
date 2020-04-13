import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
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
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, ObservationRequest } from '../state/observations.reducer';
import { HistoryTable } from './history-table.component';
import Icon from '@material-ui/core/Icon';

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
      minWidth: 200,
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
      verticalAlign: '-20px',
      top: '-30px',
      textAlign: 'center',
      position: 'relative',
      background: '#fff',
      padding: '0 15px 0 30px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    legend: {
      fontWeight: "bolder",
      color: "#128aba",
      fontSize: '1rem',
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
      /*background: 'linear-gradient(to right,transparent,#dedede,transparent)',*/
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
    title: '',
    amount_observed: '',
    projected: '',
    solved: '',
    comments: '',
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
            <>
              <form onSubmit={handleSubmit}>
                {/* <fieldset className={classes.fieldset}> */}
                {/* <legend>CyTG:</legend> */}

                {/*
                <hr  className={classes.hrSpacer} />
                <hr  className={classes.hrDivider} />
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend} >
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      CyTG
                    </Typography>
                  </legend>
                </fieldset>
                */}

                <Grid container spacing={3}>
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
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="audit">Auditor&iacute;a no.</InputLabel>
                      <Select
                        labelId="audit"
                        id="audit-select"
                        value={catalog ? values.audit_id || '' : ''}
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
                </Grid>

                <Grid container spacing={3}>
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
                {/* </fieldset> */}

                <hr  className={classes.hrSpacer} />
                <hr  className={classes.hrDivider} />
                
                <fieldset className={classes.fieldset}>
                  <legend className={classes.containerLegend} >
                    <Typography variant="body2" align="center" classes={{root:classes.legend}}>
                      {/*<Icon> attach_money </Icon>*/}
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
                  </Grid>
                  <HistoryTable history={(observation && observation.mutatedAmounts) || []} />
                </fieldset>
                {/*
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && errors.email}
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {errors.password && touched.password && errors.password}
                  */}
                <Button
                  variant="contained"
                  className={classes.submitInput}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {!id ? 'Crear' : 'Actualizar'}
                </Button>
              </form>
            </>
          );
        }}
      </Formik>
    </Paper>
  );
};
