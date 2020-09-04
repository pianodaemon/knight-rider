import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

export const Unauthorized = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h1" component="h2" gutterBottom>
              401
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                Acceso No Autorizado. Si cree que esto es un error, intente iniciar sesión de nuevo o contacte al Administrador.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
