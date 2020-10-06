import React from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loading from '../layouts/Loading';

import { isAuthenticated } from '../api';
import { VIEWS } from './config';

export const LoadableDashboard = Loadable({
  loader: () => import('../layouts/Dashboard'),
  loading: Loading
});

class DashboardRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.Loading
    };

    isAuthenticated()
      .then(() => {
        this.setState({ view: VIEWS.Dashboard });
      })
      .catch(err => {
        this.setState({ view: VIEWS.Login });
      });
  }

  render() {
    const { view } = this.state;

    if (view === VIEWS.Login) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
    if (view === VIEWS.Dashboard) {
      return <LoadableDashboard {...this.props} />;
    }
    return <Loading />;
  }
}

export default DashboardRoute;
