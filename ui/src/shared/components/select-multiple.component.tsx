import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

type Props = {
  title: string,
  options?: Array<{
    id: any,
    description: string,
  }>,
  items: Array<string>,
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void,
  name: string,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      '& > *': {
        // margin: theme.spacing(1),
        width: 'auto',
        // maxWidth: '300px',
        // height: theme.spacing(16),
        flexWrap: 'wrap',
      },
      '& > div': {
        overflowY: 'scroll',
        maxHeight: '300px',
      },
      '& > * > fieldset': {
        wordBreak: 'break-all',
      },
      '& > span': {
        marginBottom: theme.spacing(1),
      },
      marginBottom: theme.spacing(3),
      // maxHeight: '100px',
    },
    formControl: {
      margin: theme.spacing(1),
    },
  }),
);

export function CheckboxesGroup({
  items,
  name,
  options,
  title,
  onChange,
}: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormLabel component="span">{title}</FormLabel>
      <Paper elevation={3}>
        <FormControl component="fieldset" className={classes.formControl}>
          {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
          <FormGroup>
            {options &&
              options.map((option, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={
                        options &&
                        options
                          .map((op) => op.id.toString())
                          .includes(
                            items &&
                              items.find((i: any) => i === option.id.toString())
                          )
                      }
                      onChange={onChange}
                      name={name}
                      value={option.id}
                    />
                  }
                  label={option.description}
                  key={`${option.id}-${index.toString().concat('index')}`}
                />
              ))}
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>
      </Paper>
    </div>
  );
}
