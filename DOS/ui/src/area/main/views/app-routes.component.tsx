import React, { useEffect } from 'react';
import { History } from 'history';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { AuditTableContainer } from '../../auditories/views/audit-table.container';
// import { TableContainer } from '../../auditories/views/table.container';
import { UsersTableContainer } from '../../users/views/users-table.container';
// import { FormContainer } from '../../auditories/views/form.container';
import { ObservationsSFPFormContainer } from '../../observations-sfp/views/observation-sfp-form.container';
import { ObservationsASFFormContainer } from '../../observations-asf/views/observation-asf-form.container';
import { LoginFormContainer } from '../../auth/views/login-form.container';
import { AuditContainer } from '../../auditories/views/audit-form.container';
import { UsersFormContainer } from '../../users/views/users-form.container';
import { ResultsReportFormContainer as RForm } from '../../auditories/views/results-report-form.container';
import { NotFound } from './not-found.component';
import { Unauthorized } from './unauthorized.component';
import { ObservationSFPTableContainer } from '../../observations-sfp/views/observation-sfp-table.container';
import { ObservationASENLTableContainer } from '../../observations-asenl/views/observation-asenl-table.container';
import { ObservationASENLFormContainer } from '../../observations-asenl/views/observation-asenl-form.container';
import { ObservationASFTableContainer } from '../../observations-asf/views/observation-asf-table.container';
import { ResultsReportTableContainer } from '../../results-report/views/results-report-table.container';
import { ResultsReportFormContainer } from '../../results-report/views/results-report-form.container';
import { ResultsReportASENLTableContainer } from '../../results-report-asenl/views/results-report-asenl-table.container';
import { ResultsReportASENLFormContainer } from '../../results-report-asenl/views/results-report-asenl-form.container';
import { ObservationCYTGTableContainer } from '../../observations-cytg/views/observation-cytg-table.container';
import { ObservationCYTGFormContainer } from '../../observations-cytg/views/observation-cytg-form.container';
import { ResultsReportCYTGTableContainer } from '../../results-report-cytg/views/results-report-cytg-table.container';
import { ResultsReportCYTGFormContainer } from '../../results-report-cytg/views/results-report-cytg-form.container';
import { ReportsPreliminariesContainer } from '../../reports/views/reports-preliminaries.container';
import { Reports52PreliminariesContainer } from '../../reports/views/reports52-preliminaries.container';
import { Reports54Container } from '../../reports/views/reports54.container';
import { Reports55Container } from '../../reports/views/reports55.container';
import { Reports56Container } from '../../reports/views/reports56.container';
import { Reports57Container } from '../../reports/views/reports57.container';
import { Reports58Container } from '../../reports/views/reports58.container';
import { Reports59Container } from '../../reports/views/reports59.container';
import { Reports61Container } from '../../reports/views/reports61.container';
import { Reports63Container } from '../../reports/views/reports63.container';
import { TabPanelMenu } from './home-screen.component';
import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

type Props = {
  history: History,
  checkAuthAction: Function,
  isLoggedIn: boolean,
  checked: boolean,
  isAllowed: Function,
};

type CustomRoute = {
  props: {
    path: Array<string> | string,
    exact?: boolean,
  },
  component: JSX.Element,
  app?: string,
};

const routes: Array<CustomRoute> = [
  {
    props: {
      path: ['/', '/menu', '/menu/:category'],
      exact: true,
    },
    component: <TabPanelMenu />,
  },
  {
    props: {
      path: ['/audit/create', '/audit/:id/edit'],
      exact: true,
    },
    component: <AuditContainer />,
    app: 'AUD',
  },
  {
    props: {
      path: ['/audit/list'],
      exact: true,
    },
    component: <AuditTableContainer />,
    app: 'AUD',
  },
  {
    props: {
      path: ['/observation/list'],
      exact: true,
    },
    component: <NotFound />,
  },
  {
    props: {
      path: ['/observation/create', '/observation/:id/edit'],
      exact: true,
    },
    component: <NotFound />,
  },
  {
    props: {
      path: ['/observation-asf/list'],
      exact: true,
    },
    component: <ObservationASFTableContainer />,
    app: 'ASFP',
  },
  {
    props: {
      path: ['/observation-asf/create', '/observation-asf/:id/:action(edit|view)'],
      exact: true,
    },
    component: <ObservationsASFFormContainer />,
    app: 'ASFP',
  },
  {
    props: {
      path: ['/observation-sfp/list'],
      exact: true,
    },
    component: <ObservationSFPTableContainer />,
    app: 'SFPR',
  },
  {
    props: {
      path: ['/observation-sfp/create', '/observation-sfp/:id/:action(edit|view)'],
      exact: true,
    },
    component: <ObservationsSFPFormContainer />,
    app: 'SFPR',
  },
  {
    props: {
      path: ['/observation-asenl/list'],
      exact: true,
    },
    component: <ObservationASENLTableContainer />,
    app: 'ASEP',
  },
  {
    props: {
      path: ['/observation-asenl/create', '/observation-asenl/:id/:action(edit|view)'],
      exact: true,
    },
    component: <ObservationASENLFormContainer />,
    app: 'ASEP',
  },
  {
    props: {
      path: ['/results-report/create', '/results-report/:id/:action(edit|view)'],
      exact: true,
    },
    component: <ResultsReportFormContainer />,
    app: 'ASFR',
  },
  {
    props: {
      path: ['/results-report/list'],
      exact: true,
    },
    component: <ResultsReportTableContainer />,
    app: 'ASFR',
  },
  {
    props: {
      path: [
        '/results-report-asenl/create',
        '/results-report-asenl/:id/:action(edit|view)',
      ],
      exact: true,
    },
    component: <ResultsReportASENLFormContainer />,
    app: 'ASER',
  },
  {
    props: {
      path: ['/results-report-asenl/list'],
      exact: true,
    },
    component: <ResultsReportASENLTableContainer />,
    app: 'ASER',
  },
  {
    props: {
      path: ['/observation-cytg/list'],
      exact: true,
    },
    component: <ObservationCYTGTableContainer />,
    app: 'CYTP',
  },
  {
    props: {
      path: ['/observation-cytg/create', '/observation-cytg/:id/:action(edit|view)'],
      exact: true,
    },
    component: <ObservationCYTGFormContainer />,
    app: 'CYTP',
  },
  {
    props: {
      path: [
        '/results-report-cytg/create',
        '/results-report-cytg/:id/:action(edit|view)',
      ],
      exact: true,
    },
    component: <ResultsReportCYTGFormContainer />,
    app: 'CYTR',
  },
  {
    props: {
      path: ['/results-report-cytg/list'],
      exact: true,
    },
    component: <ResultsReportCYTGTableContainer />,
    app: 'CYTR',
  },
  {
    props: {
      path: ['/user/create', '/user/:id/edit'],
      exact: true,
    },
    component: <UsersFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/user/list'],
      exact: true,
    },
    component: <UsersTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/results_report/create'],
      exact: true,
    },
    component: <RForm />,
  },
  {
    props: {
      path: ['/reports-52'],
      exact: true,
    },
    component: <Reports52PreliminariesContainer />,
    app: 'R52',
  },
  {
    props: {
      path: ['/reports-53'],
      exact: true,
    },
    component: <ReportsPreliminariesContainer />,
    app: 'R53',
  },
  {
    props: {
      path: ['/reports-54'],
      exact: true,
    },
    component: <Reports54Container />,
    app: 'R54',
  },
  {
    props: {
      path: ['/reports-55'],
      exact: true,
    },
    component: <Reports55Container />,
    app: 'R55',
  },
  {
    props: {
      path: ['/reports-56'],
      exact: true,
    },
    component: <Reports56Container />,
    app: 'R56',
  },
  {
    props: {
      path: ['/reports-57'],
      exact: true,
    },
    component: <Reports57Container />,
    app: 'R57',
  },
  {
    props: {
      path: ['/reports-58'],
      exact: true,
    },
    component: <Reports58Container />,
    app: 'R58',
  },
  {
    props: {
      path: ['/reports-59'],
      exact: true,
    },
    component: <Reports59Container />,
    app: 'R59',
  },
  {
    props: {
      path: ['/reports-61'],
      exact: true,
    },
    component: <Reports61Container />,
    app: 'R61',
  },
  {
    props: {
      path: ['/reports-63'],
      exact: true,
    },
    component: <Reports63Container />,
    app: 'R63',
  },
  {
    props: {
      path: "/sign-in",
      exact: true,
    },
    component: <Redirect to='/menu' />,
  },
  {
    props: {
      path: "*",
      exact: true,
    },
    component: <NotFound />,
  },
];

export const AppRoutes = (props: Props) => {
  useEffect(() => {
    props.checkAuthAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { isAllowed } = props;
  const match: any | null = useRouteMatch([
    '/:module/:view(list|create)',
    '/:module/:id/:action(edit|view)',
  ]);
  const hasAccess = (app: string | undefined) => {
    if (!app) {
      return true;
    }
    if (
      !(match && match.params && (match.params.view || match.params.action))
    ) {
      return isAllowed(app);
    }
    const { action, view } = match.params;
    const type = action || view;
    switch(type) {
      case 'create':
        return isAllowed(app, PERMISSIONS.CREATE);
      case 'list':
      case 'view':
        return isAllowed(app, PERMISSIONS.READ);
      case 'edit':
        return isAllowed(app, PERMISSIONS.UPDATE);
      default:
        return false;
    }
  };
  return (
    <>
    {props.checked && (
      !props.isLoggedIn ? (
      <>
        <Route path="*">
          <LoginFormContainer />
        </Route>
      </>
      ) : (
      <Switch>
        {routes.map((route: CustomRoute, index: number) => {
          return (
            <Route {...route.props} key={`${index}-${route.app}`}>
              {hasAccess(route.app) ? route.component : <Unauthorized />}
            </Route>
          );
        })}
      </Switch>
      )
    )}
    </>
  );
};
