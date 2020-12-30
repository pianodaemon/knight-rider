import React from 'react';
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import { MenuCard } from 'src/shared/components/menu-card.component';
import { resolvePermission } from 'src/shared/utils/permissions.util';

interface TabPanelProps {
  children?: React.ReactNode;
  classes: any,
  index: any;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  box: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    // '& div:nth-child(1)': { order: 1, },
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  }
}));

function TabPanel(props: TabPanelProps) {
  const { children, classes, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.box}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const renderIcon = (icon: string) => {
  switch(icon) {
    case "AccountBalanceIcon":
      return <AccountBalanceIcon />;
    case "ListAltIcon":
      return <ListAltIcon />;
    case "DeveloperBoardIcon":
      return <DeveloperBoardIcon />;
    case "LibraryBooksIcon":
      return <LibraryBooksIcon />;
    case "SettingsIcon":
      return <SettingsIcon />;
    case "PersonIcon":
      return <PersonIcon />;
    default: 
      return <ListAltIcon />;
  }
};

const tabCategories = {
  catalogos: {
    icon: "ListAltIcon",
    name: "Catálogos",
    menuItems: [
      {
        AUD: {
          color: '#5232C2',
          icon: "AccountBalanceIcon",
          name: "Auditorías",
          path: "/audit/list"
        },
      },
      {
        DEP: {
          color: '#5232C2',
          icon: "AccountBalanceIcon",
          name: "Dependencias",
          path: "/dependency/list"
        },
      },
      {
        DEP: {
          color: '#5232C2',
          icon: "AccountBalanceIcon",
          name: "Programas Sociales",
          path: "/social-program/list"
        },
      },
    ],
    path: "/catalogos",
  },
  captura: {
    icon: "DeveloperBoardIcon",
    name: "Captura",
    menuItems: [
      {
        SFPR: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones SFP",
          path: "/observation-sfp/list"
        },
      },
      {
        ASFP: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares ASF",
          path: "/observation-asf/list"
        },
      },
      {
        ASEP: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares ASENL",
          path: "/observation-asenl/list"
        },
      },
      {
        CYTP: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares CyTG",
          path: "/observation-cytg/list"
        },
      },
      {
        paddingElement: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Hidden Item",
          path: "/404",
          hide: true,
        },
      },
      {
        ASFR: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados ASF",
          path: "/results-report/list"
        },
      },
      {
        ASER: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados ASENL",
          path: "/results-report-asenl/list"
        },
      },
      {
        CYTR: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados CYTG",
          path: "/results-report-cytg/list"
        },
      },
    ],
    path: "/captura",
  },
  reportes: {
    icon: "LibraryBooksIcon",
    name: "Reportes",
    menuItems: [
      {
        R52: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Total Informe de Resultados",
          path: "/reports-52"
        },
      },
      {
        R53: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados",
          path: "/reports-53"
        },
      },
      {
        R54: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Informe Preliminar",
          path: "/reports-54"
        },
      },
      {
        R55: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Atendidas y Por Atender",
          path: "/reports-55"
        },
      },
      {
        R56: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Pendientes de Solventar",
          path: "/reports-56"
        },
      },
      {
        R57: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Observaciones por su Tipo",
          path: "/reports-57"
        },
      },
      {
        R58: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Observaciones por su Clasificación",
          path: "/reports-58"
        },
      },
      {
        R59: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Obras Públicas",
          path: "/reports-59"
        },
      },
      {
        R61: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Reporte de Detalle",
          path: "/reports-61"
        },
      },
      {
        R63: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Reporte de Detalle (No montos)",
          path: "/reports-63"
        },
      },
    ],
    path: "/reportes",
  },
  admin: {
    icon: "SettingsIcon",
    name: "Catálogos",
    menuItems: [
      {
        USR: {
          color: '#038BBB',
          icon: "PersonIcon",
          name: "Usuarios",
          path: "/user/list"
        }, 
      }
    ],
    path: "/admin",
  },
};

export const TabPanelMenu = () => {
  const categories: Array<any> = Object.entries(tabCategories);
  const categoryIndexes: Array<string> = Object.keys(tabCategories);
  const history = useHistory();
  const { category } = useParams<any>();
  const classes = useStyles();
  const [value, setValue] = React.useState(categoryIndexes.findIndex(key => key === category));
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  const permissions: any = useSelector((state: any) => state.authSlice);
  const isVisible = (app: string): boolean => resolvePermission(permissions?.claims?.authorities, app);
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {categories.map((tab: any, index: number) => {
              const [name, tabProps] = tab;
              const { icon } = tabProps;
              return <Tab
                label={name}
                icon={renderIcon(icon)}
                {...a11yProps(index)}
                key={name}
                onClick={() => history.push(`/menu/${name}`)}
              />;
            }
          )}
        </Tabs>
      </AppBar>
      {categories.map((tab: any, index: number) => {
          const [name, tabProps] = tab;
          return (
            <Grow in={value=== index} key={`${index}-${name}`}>
              <TabPanel value={value} index={index} key={name} classes={classes}>
                {
                  Object
                  .values(tabProps.menuItems)
                  .filter((menuItem: any) => isVisible(Object.keys(menuItem)[0]) || Object.keys(menuItem)[0] === 'paddingElement')
                  .map((item: any, index2: number) => { 
                    const [menuItem] = Object.values(item);
                    return <MenuCard item={menuItem} key={index2} />;
                  })
                }
              </TabPanel>
            </Grow>
          );
        }
      )}
    </div>
  );
}
