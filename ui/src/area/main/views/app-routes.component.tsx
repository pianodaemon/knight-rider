import React, { useEffect } from 'react';
import { History } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { AuditTableContainer } from '../../auditories/views/audit-table.container';
import { TableContainer } from '../../auditories/views/table.container';
import { UsersTableContainer } from '../../users/views/users-table.container';
import { FormContainer } from '../../auditories/views/form.container';
import { ObservationsSFPFormContainer } from '../../observations-sfp/views/observation-sfp-form.container';
import { ObservationsASFFormContainer } from '../../observations-asf/views/observation-asf-form.container';
import { AuditContainer } from '../../auditories/views/audit-form.container';
import { UsersFormContainer } from '../../users/views/users-form.container';
import { ResultsReportFormContainer as RForm } from '../../auditories/views/results-report-form.container';
import { NotFound } from './not-found.component';
import { ObservationSFPTableContainer } from '../../observations-sfp/views/observation-sfp-table.container';
import { ObservationASFTableContainer } from '../../observations-asf/views/observation-asf-table.container';
import { ResultsReportTableContainer } from '../../results-report/views/results-report-table.container';
import { ResultsReportFormContainer } from '../../results-report/views/results-report-form.container';

type Props = {
  history: History,
  loadCatalogAction: Function,
  loadCatalogObsSFPAction: Function,
  loadCatalogObsASFAction: Function,
  loadCatalogResultsReportAction: Function,
  loadAuditCatalogAction: Function,
  loadUsersCatalogAction: Function,
};

export const AppRoutes = (props: Props) => {
  useEffect(() => {
    props.loadCatalogObsSFPAction();
    props.loadCatalogObsASFAction();
    props.loadCatalogAction();
    props.loadAuditCatalogAction();
    props.loadUsersCatalogAction();
    props.loadCatalogResultsReportAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Router history={props.history}>
      <Switch>
        <Route exact path={['/audit/create', '/audit/:id/edit']}>
          <AuditContainer />
        </Route>
        <Route exact path={['/audit/list']}>
          <AuditTableContainer />
        </Route>
        <Route exact path={['/', '/observation/list']}>
          <TableContainer />
        </Route>
        <Route exact path={['/observation/create', '/observation/:id/edit']}>
          <FormContainer />
        </Route>
        <Route exact path={['/', '/observation-asf/list']}>
          <ObservationASFTableContainer />
        </Route>
        <Route
          exact
          path={['/observation-asf/create', '/observation-asf/:id/edit']}
        >
          <ObservationsASFFormContainer />
        </Route>
        <Route exact path={['/', '/observation-sfp/list']}>
          <ObservationSFPTableContainer />
        </Route>
        <Route
          exact
          path={['/observation-sfp/create', '/observation-sfp/:id/edit']}
        >
          <ObservationsSFPFormContainer />
        </Route>
        <Route
          exact
          path={['/results-report/create', '/results-report/:id/edit']}
        >
          <ResultsReportFormContainer />
        </Route>
        <Route exact path={['/', '/results-report/list']}>
          <ResultsReportTableContainer />
        </Route>
        <Route exact path={['/user/create', '/user/:id/edit']}>
          <UsersFormContainer />
        </Route>
        <Route exact path={['/', '/user/list']}>
          <UsersTableContainer />
        </Route>
        <Route exact path={['/results_report/create']}>
          <RForm />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
