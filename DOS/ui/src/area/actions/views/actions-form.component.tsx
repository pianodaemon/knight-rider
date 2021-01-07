import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import mxLocale from 'date-fns/locale/es';
import DateFnsUtils from '@date-io/date-fns';
import { Catalog, Action } from '../state/actions.reducer';

type Props = {
  createActionAction: Function,
  readActionAction: Function,
  updateActionAction: Function,
  actionRecord: Action | null,
  catalog: Catalog | null,
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

export const ActionsForm = (props: Props) => {
  const {
    createActionAction,
    actionRecord,
    updateActionAction,
    catalog,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const { action, id, org_fiscal_id } = useParams<any>();
  const disabledModeOn = action === 'view';
  const initialValues = {
    id: '',
    org_fiscal_id: org_fiscal_id,
    title: '',
    description: '',
  };
  const fiscal =
    catalog &&
    catalog.fiscals &&
    catalog.fiscals.find((fiscal: any) => fiscal.id === parseInt(org_fiscal_id, 10))?.title;
  const getFiscal = (id: number): string | null | undefined => 
    catalog &&
    catalog.fiscals &&
    catalog.fiscals.find((fiscal: any) => fiscal.id === id)?.title;
  useEffect(() => {
    if (id) {
      props.readActionAction({ id, org_fiscal_id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const validate = (values: any) => {
    const errors: any = {};
    const fields = Object.keys(initialValues);
    const noMandatoryFields: Array<string> = [
      "sorting_val",
    ];
    const mandatoryFields: Array<string> = [
      "title",
      "org_fiscal_id",
      "description",
    ];
    // Mandatory fields (not empty)
    fields
      .filter((field) => !noMandatoryFields.includes(field))
      .filter(field => mandatoryFields.includes(field))
      .forEach((field: string) => {
        if (!values[field] && field === "org_fiscal_id" && !action) {
          errors[field] = 'Required';
          return;
        } else if (field === "org_fiscal_id" && action !== "create") {
          return;
        }
        if (field === "description" && (fiscal === "ASF" || getFiscal(values.org_fiscal_id) === "ASF")) {
          return;
        }
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
        initialValues={id ? actionRecord || initialValues : initialValues}
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
            let description = fields.description;
            let fiscal_id = fields.org_fiscal_id || org_fiscal_id;
            const { title } = fields;
            updateActionAction({ id, description, org_fiscal_id: fiscal_id, title, history, releaseForm });
          } else {
            createActionAction({ fields, history, releaseForm });
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
        }) => {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
              <h1 style={{ color: '#128aba' }}>
                Acción (ASF y ASENL)
              </h1>
              <hr className={classes.hrDivider} />
              <form onSubmit={handleSubmit} className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="title"
                        label="Siglas de la acción"
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
                            Ingrese Siglas de la acción
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  {/* @hardcoded value */}
                  {(getFiscal(values.org_fiscal_id) !== "ASF") && (
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="description"
                        label="Nombre de la acción"
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
                            Ingrese Nombre de la acción
                          </FormHelperText>
                        )}
                    </FormControl>
                  </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel>Órgano fiscalizador</InputLabel>
                      <Select
                        disabled={disabledModeOn || action === 'edit'}
                        labelId="org_fiscal_id"
                        id="org_fiscal_id-select"
                        value={catalog && catalog.fiscals ? values.org_fiscal_id || org_fiscal_id || '' : ''}
                        onChange={handleChange('org_fiscal_id')}
                      >
                        {catalog &&
                          catalog.fiscals &&
                          catalog.fiscals.map((item) => {
                            return (
                              <MenuItem value={item.id} key={`type-${item.id}`}>
                                {item.title}
                              </MenuItem>
                            );
                          })}
                      </Select>
                      {errors.org_fiscal_id && touched.org_fiscal_id && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese órgano fiscalizador
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
