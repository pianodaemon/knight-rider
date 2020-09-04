import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      maxHeight: 345,
      width: '100%',
      height: '100%',
      margin: '35px'
    },
    cardHeaderRoot: {
      flexDirection: 'column',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      border: '4px solid rgba(255,255,255,0.3)',
      backgroundColor: 'transparent',
      height: 100,
      width: 100,
    },
    linkRibbon: {
      backgroundColor: 'rgb(200,255,255,.1)',
      color: 'rgb(255,255,255,.7)',
      textAlign: 'center',
      padding: '5px 0px',
      transition: '0.3s',
      '&:hover': {
        backgroundColor: 'rgb(0,0,0,.3)',
      },
    },
    hideDownMd: {
      [theme.breakpoints.down('lg')]: {
        display: 'none',
      },
    }
  }),
);

const renderIcon = (icon: string) => {
  const props = { style: { fontSize: '3em' } };
  switch(icon) {
    case "AccountBalanceIcon":
      return <AccountBalanceIcon {...props}  />;
    case "LibraryBooksIcon":
      return <LibraryBooksIcon {...props} />;
    case "PersonIcon":
      return <PersonIcon {...props} />;
    default: 
      return <ListAltIcon {...props} />;
  }
};

type Props = {
  item: any,
};

export const MenuCard: (props: Props) => any = (props: Props) => {
  const { item } = props;
  const classes = useStyles();
  return (
    <Card
      className={clsx(classes.root, Boolean(item.hide) && classes.hideDownMd)}
      style={{backgroundColor: item.color, visibility: Boolean(item.hide) ? 'hidden' : 'visible' }}
    >
      <CardHeader
        className={classes.cardHeaderRoot}
        avatar={
          <Link 
            to={item.path}
            style={{textDecoration: 'none'}}
          >
            <Avatar aria-label="recipe" className={classes.avatar}>
              {renderIcon(item.icon)}
            </Avatar>
          </Link>
        }
      />
      <CardContent style={{padding: 0}}>
        <Link 
          to={item.path}
          style={{textDecoration: 'none'}}
        >
          <Typography className={classes.linkRibbon} variant="body1" component="p">
            {item.name} 
            <KeyboardArrowRightIcon 
              style={{
                verticalAlign: 'middle',
                backgroundColor: 'rgb(255,255,255,0.3)',
                borderRadius: '50%',
                marginLeft: '10px'
              }} 
            />
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
}
