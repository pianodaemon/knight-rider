import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { AutoCompleteDropdown } from 'src/shared/components/autocomplete-dropdown.component';
import { Catalog, Audit } from '../state/audits.reducer';

type Props = {
  audit: Audit | null,
  catalog: Catalog | null,
  createAuditAction: Function,
  readAuditAction: Function,
  updateAuditAction: Function,
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
      top: '-30px',
      position: 'relative',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      width: '128px',
      margin: '0px auto',
      textAlign: 'center',
      background: 'transparent',
    },
    legend: {
      fontWeight: 'bolder',
      color: '#128aba',
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
  }),
);

export const AuditsForm = (props: Props) => {
  const { catalog, createAuditAction, audit, updateAuditAction } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const initialValues = {
    title: '',
    dependency_id: '',
    year: '',
  };
  useEffect(() => {
    if (id) {
      props.readAuditAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={id ? audit || initialValues : initialValues}
        validate={(values: any) => {
          const errors: any = {};
          if (!values.title) {
            errors.title = 'Required';
          }

          if (!values.dependency_id) {
            errors.dependency_id = 'Required';
          }

          if (!values.year) {
            errors.year = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = values;
          if (id) {
            delete fields.id;
            updateAuditAction({ id, fields, history, releaseForm });
          } else {
            createAuditAction({ fields, history, releaseForm });
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
          return (
            <>
              <form onSubmit={handleSubmit}>
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
                      <AutoCompleteDropdown
                        fieldLabel="title"
                        fieldValue="id"
                        label="Dependencia"
                        name="dependencia"
                        onChange={(value: any) => {
                          return setFieldValue('dependency_id', value);
                        }}
                        options={
                          catalog && catalog.dependencies
                            ? catalog.dependencies
                            : []
                        }
                        value={catalog ? values.dependency_id || '' : ''}
                      />
                      {errors.dependency_id &&
                        touched.dependency_id &&
                        errors.dependency_id && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Elige una dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="year"
                        label="Año"
                        value={values.year || ''}
                        onChange={handleChange('year')}
                        inputProps={{ type: 'number', min: 1900 }}
                      />
                      {errors.year && touched.year && errors.year && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese un año
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
            </>
          );
        }}
      </Formik>
    </Paper>
  );
};
