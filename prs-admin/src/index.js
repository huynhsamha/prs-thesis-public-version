import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

/**
 * i18n-next
 */
// import './i18n';

/**
 * Styles
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/paper-dashboard.scss';
import './assets/demo/demo.css';

/**
 * Routes
 */
import LoginRoute from './routes/LoginRoute';
import DashboardRoute from './routes/DashboardRoute';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route path="/login" exact render={props => <LoginRoute {...props} />} />
      <Route path="/" render={props => <DashboardRoute {...props} />} />
      <Redirect from="/" to="/" />
    </Switch>
  </Router>,
  document.getElementById('root')
);
