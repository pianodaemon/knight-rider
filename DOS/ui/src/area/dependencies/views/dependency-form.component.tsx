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
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import mxLocale from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { Catalog, Dependency } from '../state/dependencies.reducer';

type Props = {
  createDependencyAction: Function,
  readDependencyAction: Function,
  updateDependencyAction: Function,
  catalog: Catalog | null,
  dependency: Dependency | null,
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

export const DependecyForm = (props: Props) => {
  const {
    catalog,
    createDependencyAction,
    dependency,
    updateDependencyAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { action, id } = useParams<any>();
  const disabledModeOn = action === 'view';
  const initialValues = {
    id: '',
    title: '',
    description: '',
    clasif_id: '',
  };
  useEffect(() => {
    if (id) {
      props.readDependencyAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const noMandatoryFields: Array<string> = [
      "id",
    ];
    const mandatoryFields: Array<string> = [
      "title",
      "description",
      "clasif_id",
    ];
    // Mandatory fields (not empty)
    fields
      .filter((field) => !noMandatoryFields.includes(field))
      .filter(field => mandatoryFields.includes(field))
      .forEach((field: string) => {
        if (!values[field] || values[field] instanceof Date) {
          errors[field] = 'Required';
        }
      });
    return errors;
  };
  return (
    <Paper className={classes.paper}>
      <Formik
        // validateOnChange={false}
        initialValues={id ? dependency || initialValues : initialValues}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const releaseForm: () => void = () => setSubmitting(false);
          const fields: any = {
            ...values,
          };
          Object.keys(fields).forEach((field: any) => {
            if (fields[field] === null) {
              fields[field] = "";
            }
          });
          if (id) {
            delete fields.id;
            updateDependencyAction({ id, fields, history, releaseForm });
          } else {
            createDependencyAction({ fields, history, releaseForm });
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
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>
                Dependencia
              </h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit} className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="title"
                        label="Título o siglas de la Dependencia"
                        value={values.title || ''}
                        onChange={handleChange('title')}
                        disabled={disabledModeOn}
                      />
                      {errors.title &&
                        touched.title && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Título o siglas de la Dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="description"
                        label="Descripción de la Dependencia"
                        value={values.description || ''}
                        onChange={handleChange('description')}
                        disabled={disabledModeOn}
                      />
                      {errors.description &&
                        touched.description && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese Descripción de la Dependencia
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Clasificación de la Dependencia</InputLabel>
                      <Select
                        disabled={disabledModeOn}
                        labelId="clasif_id"
                        id="clasif_id-select"
                        value={catalog && catalog.dependencia_clasif ? values.clasif_id || '' : ''}
                        onChange={handleChange('clasif_id')}
                      >
                        {catalog &&
                          catalog.dependencia_clasif &&
                          catalog.dependencia_clasif.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.clasif_id && touched.clasif_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese Clasificación de la Dependencia
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
            </MuiPickersUtilsProvider>
          );
        }}
      </Formik>
    </Paper>
  );
};
