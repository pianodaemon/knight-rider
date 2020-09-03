import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Grow from '@material-ui/core/Grow';

import { MenuCard } from 'src/shared/components/menu-card.component';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{display: 'flex', flexWrap: 'wrap', justifyContent: index === 1 ? 'flex-end' : 'left'}}>
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
        audits: {
          color: '#5232C2',
          icon: "AccountBalanceIcon",
          name: "Auditorías",
          path: "/audit/list"
        },
      }
    ],
    path: "/catalogos",
  },
  captura: {
    icon: "DeveloperBoardIcon",
    name: "Captura",
    menuItems: [
      { 
        sfp: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones SFP",
          path: "/observation-sfp/list"
        },
      },
      { 
        asf: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares ASF",
          path: "/observation-asf/list"
        },
      },
      { 
        asfRes: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados ASF",
          path: "/results-report/list"
        },
      },
      { 
        asenl: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares ASENL",
          path: "/observation-asenl/list"
        },
      },
      { 
        asenlRes: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados ASENL",
          path: "/results-report-asenl/list"
        },
      },
      { 
        cytg: {
          color: '#2565BE',
          icon: "DeveloperBoardIcon",
          name: "Observaciones Preliminares CyTG",
          path: "/observation-cytg/list"
        },
      },
      { 
        cytgRes: {
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
        reports52: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Total Informe de Resultados",
          path: "/reports-52"
        },
      },
      { 
        reports53: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Informe de Resultados",
          path: "/reports-53"
        },
      },
      { 
        reports54: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Informe Preliminar",
          path: "/reports-54"
        },
      },
      { 
        reports55: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Atendidas y Por Atender",
          path: "/reports-55"
        },
      },
      { 
        reports56: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Pendientes de Solventar",
          path: "/reports-56"
        },
      },
      { 
        reports57: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Observaciones por su Tipo",
          path: "/reports-57"
        },
      },
      { 
        reports58: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Observaciones por su Clasificación",
          path: "/reports-58"
        },
      },
      { 
        reports59: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Obras Públicas",
          path: "/reports-59"
        },
      },
      { 
        reports61: {
          color: '#0E7EBC',
          icon: "DeveloperBoardIcon",
          name: "Reporte de Detalle",
          path: "/reports-61"
        },
      },
      { 
        reports63: {
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
        users: {
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
              return <Tab label={name} icon={renderIcon(icon)} {...a11yProps(index)} key={name} onClick={() => history.push(`/menu/${name}`)} />;
            }
          )}
        </Tabs>
      </AppBar>
      {categories.map((tab: any, index: number) => {
          const [name, tabProps] = tab;
          return (
            <Grow in={value=== index} key={`${index}-${name}`}>
              <TabPanel value={value} index={index} key={name}>
                {
                  Object
                  .values(tabProps.menuItems)
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