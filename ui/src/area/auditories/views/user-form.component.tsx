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
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from '@date-io/date-fns';
import { FormikDatePicker } from 'src/shared/components/formik/formik-date-picker.component'
import { NumberFormatCustom } from 'src/shared/components/number-format-custom.component';
import { Catalog, ObservationRequest } from '../state/observations.reducer';
import { Catalog as AuditCatalog } from '../state/audits.reducer';
import { HistoryTable } from './history-table.component';

type Props = {
  createObservationAction: Function,
  readObservationAction: Function,
  updateObservationAction: Function,
  catalog: Catalog | null,
  auditsCatalog: AuditCatalog | null,
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

export const UserForm = (props: Props) => {
  const {
    auditsCatalog,
    catalog,
    createObservationAction,
    observation,
    updateObservationAction,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const initialValues = {
    username: '',
    passwd: '',
    orgchart_role_id: '',
    division_role_id: '',
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
        initialValues={initialValues}
        validate={(values: any) => {
          const errors: any = {};
          if (!values.username) {
            errors.username = 'Required';
          }

          if (!values.passwd) {
            errors.passwd = 'Required';
          }

          if (!values.orgchart_role_id) {
            errors.orgchart_role_id = 'Required';
          }

          if (!values.division_role_id) {
            errors.division_role_id = 'Required';
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
              <h1 style={{ color: '#128aba' }}>Usuarios</h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>



                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="username"
                        label="Nombre del Usuario"
                        value={values.username ? values.username || '' : ''}
                        onChange={handleChange('username')}
                      />
                      {errors.username &&
                        touched.username && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese un Nombre de Usuario
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="passwd"
                        label="Contraseña"
                        value={values.passwd ? values.passwd || '' : ''}
                        onChange={handleChange('passwd')}
                      />
                      {errors.passwd &&
                        touched.passwd && (
                          <FormHelperText
                            error
                            classes={{ error: classes.textErrorHelper }}
                          >
                            Ingrese una Contraseña
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>

             
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        Puesto
                      </InputLabel>
                      <Select
                        labelId="orgchart_role_id"
                        id="orgchart_role_id"
                        value={values.orgchart_role_id ? values.orgchart_role_id || '' : ''}
                        onChange={handleChange('orgchart_role_id')}
                      >
                        {/*catalog &&
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
                            })*/}
                                <MenuItem
                                  value="1"
                                  key="1"
                                >
                                  Puesto 1
                                </MenuItem>
                                <MenuItem
                                  value="2"
                                  key="2"
                                >
                                  Puesto 2
                                </MenuItem>
                                <MenuItem
                                  value="3"
                                  key="3"
                                >
                                  Puesto 3
                                </MenuItem>
                      </Select>
                      {errors.orgchart_role_id &&
                          touched.orgchart_role_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione un Puesto
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>
              
 
 
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>
                        División
                      </InputLabel>
                      <Select
                        labelId="division_role_id"
                        id="division_role_id"
                        value={values.division_role_id ? values.division_role_id || '' : ''}
                        onChange={handleChange('division_role_id')}
                      >
                        {/*catalog &&
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
                            })*/}
                                <MenuItem
                                  value="1"
                                  key="1"
                                >
                                  Division 1
                                </MenuItem>
                                <MenuItem
                                  value="2"
                                  key="2"
                                >
                                  Division 2
                                </MenuItem>
                      </Select>
                      {errors.division_role_id &&
                          touched.division_role_id && (
                            <FormHelperText
                              error
                              classes={{ error: classes.textErrorHelper }}
                            >
                              Seleccione una División
                            </FormHelperText>
                          )}
                    </FormControl>
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="checkedF"
                            color="primary"
                          />
                        }
                        label="Desactivar"
                      />
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
