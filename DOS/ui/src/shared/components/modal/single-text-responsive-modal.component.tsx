import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';

type Props = {
  field: string,
  onClose: Function,
  open: boolean,
  text: string,
};

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      whiteSpace: 'pre-line',
    },
  })
);

export const SingleTextResponsiveModal = ({
  field,
  onClose,
  open,
  text,
}: Props) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{field}</DialogTitle>
      <DialogContent>
        <DialogContentText className={classes.text}>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
