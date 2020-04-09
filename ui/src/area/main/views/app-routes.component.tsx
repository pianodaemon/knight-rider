import React, { useEffect } from 'react';
import { History } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import { TableContainer } from '../../auditories/views/table.container';
import { FormContainer } from '../../auditories/views/form.container';
import { NotFound } from './not-found.component';

type Props = {
  history: History,
  loadCatalogAction: Function,
};

export const AppRoutes = (props: Props) => {
  useEffect(() => {
    props.loadCatalogAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Router history={props.history}>
      <Switch>
        <Route exact path={['/', '/observation/list']}>
          <TableContainer />
        </Route>
        <Route exact path={['/observation/create', '/observation/:id/edit']}>
          <FormContainer />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
