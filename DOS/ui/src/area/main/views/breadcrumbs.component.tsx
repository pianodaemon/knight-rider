import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }),
);

const modules = (module: string): string => {
  switch(module) {
    case "audit":
      return "Auditorías";
    case "observation-sfp":
      return "Observaciones de Resultados SFP";
    case "observation-asf":
      return "Observaciones Preliminares ASF";
    case "results-report":
        return "Observaciones de Resultados ASF";
    case "observation-asenl":
      return "Observaciones Preliminares ASENL";
    case "results-report-asenl":
      return "Informe de Resultados ASENL";
    case "observation-cytg":
      return "Observaciones Preliminares CyTG";
    case "results-report-cytg":
      return "Informe de Resultados CYTG";
    case "user":
      return "Usuarios";
    case "dependency":
      return "Dependencias";
    case "social-program":
      return "Programas Sociales";
    default:
      return "";
  }
};

const categories =  (module: string): string => {
  switch(module) {
    case "audit":
    case "dependency":
    case "social-program":
      return "catalogos";
    case "observation-sfp":
    case "observation-asf":
    case "results-report":
    case "observation-asenl":
    case "results-report-asenl":
    case "observation-cytg":
    case "results-report-cytg":
      return "captura";
    case "reporte-52":
    case "reporte-53":
    case "reporte-54":
    case "reporte-55":
    case "reporte-56":
    case "reporte-57":
    case "reporte-58":
    case "reporte-59":
    case "reporte-61":
    case "reporte-63":
      return "reportes";
    case "user":
      return "admin";
    default:
      return "";
  }
};

const action = (type: string) => {
  switch(type) {
    case "create":
      return "Crear";
    case "edit":
      return "Edición";
    case "view":
      return "Vista Rápida";
    case "list":
      return "Lista";
    default:
      return "";
  }
}

export const BreadcrumbsBar = () => {
  const classes = useStyles();
  let match: any | null = useRouteMatch([
    '/:module/:view(list|create)',
    '/:module/:id/:action(edit|view)',
    '/reports-:report(\\d+)',
  ]);
  const hidden = !match ? { style: { display: 'none' } } : {};
  return (
    <div className={classes.root} {...hidden} >
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Inicio
        </Link>
        {match && Object.keys(match).length > 1 && match.params && match.params.module &&
        <Link color="inherit" href={`/menu/${categories(match.params.module)}`}>
          {modules(match.params.module)}
        </Link>
        }
        {match && Object.keys(match).length > 1 && match.params && ((match.params.id && match.params.action) ||match.params.view) && (
          <Link color="inherit" href={`/${match.params.module}/list`}>
            Lista
          </Link>
        )}
        {match && Object.keys(match).length > 1 && match.params && ((match.params.id && match.params.action) ||match.params.view) && (
          <Typography color="textPrimary">
            {action(match.params.view || match.params.action)}
          </Typography>
        )}


        {match && Object.keys(match).length > 1 && match.params && match.params.report && (
        <Link color="inherit" href={`/menu/reportes`}>
          Reportes
        </Link>
        )}
        {match && Object.keys(match).length > 1 && match.params && match.params.report && (
          <Typography color="textPrimary">
            {match.params.report}
          </Typography>
        )}
      </Breadcrumbs>
    </div>
  );
}
