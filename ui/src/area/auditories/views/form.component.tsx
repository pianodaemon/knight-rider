import React from 'react';
import { useHistory } from 'react-router-dom';
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
import { Catalog } from '../state/observations.reducer';

type Props = {
  createObservationAction: Function,
  catalog: Catalog | null,
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
  }),
);

export const ObservationsForm = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const { catalog, createObservationAction } = props;
  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={{
          observation_type_id: '',
          social_program_id: '',
          audit_id: '',
        }}
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
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          /*
          console.log('lool');
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
          */
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = values;
          createObservationAction({ fields, history, releaseForm });
        }}
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
                    <Grid item xs={6} />
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
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Crear
                </Button>
              </form>
            </>
          );
        }}
      </Formik>
    </Paper>
  );
};
