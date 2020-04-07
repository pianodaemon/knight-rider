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

import { Catalog, Observation } from '../state/observations.reducer';

type Props = {
  createObservationAction: Function,
  readObservationAction: Function,
  updateObservationAction: Function,
  catalog: Catalog | null,
  observation: Observation | null,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 150,
    },
    fieldset: {
      borderRadius: 3,
      borderWidth: 2,
      borderColor: '#DDD',
      borderStyle: 'solid',
      margin: '20px 0px',
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
  }),
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
                <fieldset className={classes.fieldset}>
                  <legend>CyTG:</legend>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="observation-type">
                          Tipo de Auditoría
                        </InputLabel>
                        <Select
                          labelId="observation-type"
                          id="observation-type-select"
                          value={values.observation_type_id || ''}
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
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="social-program-id">Programa</InputLabel>
                        <Select
                          labelId="social-program-id"
                          id="social-program-id-select"
                          value={values.social_program_id || ''}
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="fiscal">Auditor</InputLabel>
                        <Select
                          labelId="fiscal"
                          id="fiscal-select"
                          value={values.fiscal_id || ''}
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
                    <Grid item xs={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="title"
                          label="Título"
                          value={values.title || ''}
                          onChange={handleChange('title')}
                        />
                        {errors.title && touched.title && errors.title && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingresa un t&iacute;tulo
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
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
