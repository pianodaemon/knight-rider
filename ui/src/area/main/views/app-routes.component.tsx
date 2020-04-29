import React, { useEffect } from 'react';
import { History } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { AuditTableContainer } from '../../auditories/views/audit-table.container';
import { TableContainer } from '../../auditories/views/table.container';
import { UsersTableContainer } from '../../users/views/users-table.container';
import { FormContainer } from '../../auditories/views/form.container';
import { AuditContainer } from '../../auditories/views/audit-form.container';
import { UsersFormContainer } from '../../users/views/users-form.container';
import { PreliminaryObservationFormContainer } from '../../auditories/views/preliminary-form.container';
import { NotFound } from './not-found.component';

type Props = {
  history: History,
  loadCatalogAction: Function,
  loadAuditCatalogAction: Function,
  loadUsersCatalogAction: Function,
};

export const AppRoutes = (props: Props) => {
  useEffect(() => {
    props.loadCatalogAction();
    props.loadAuditCatalogAction();
    props.loadUsersCatalogAction();
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
        <Route exact path={['/user/create', '/user/:id/edit']}>
          <UsersFormContainer />
        </Route>
        <Route exact path={['/', '/user/list']}>
          <UsersTableContainer />
        </Route>
        <Route exact path={['/preliminary/create']}>
          <PreliminaryObservationFormContainer />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
