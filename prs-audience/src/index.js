import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

/**
 * Styles
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/scss/paper-dashboard.scss';
import './assets/demo/demo.css';

/**
 * Routes
 */
import UserFeedbackFormRoute from './routes/UserFeedbackForm';
import LoginRoute from './routes/LoginRoute';
import Policy from './routes/PolicyRoute';
import Converter from './routes/ConverterRoute';
import QrGen from './routes/QrGenRoute';
import DashboardRoute from './routes/DashboardRoute';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route path="/policy" exact render={props => <Policy {...props} />} />
      <Route path="/qrgen" exact render={props => <QrGen {...props} />} />
      <Route path="/converter" exact render={props => <Converter {...props} />} />
      <Route path="/login" exact render={props => <LoginRoute {...props} />} />
      <Route path="/d/:code" exact render={props => <UserFeedbackFormRoute {...props} />} />
      <Route path="/" render={props => <DashboardRoute {...props} />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
