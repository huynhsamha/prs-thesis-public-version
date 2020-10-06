import React from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loading from '../layouts/Loading';

import { isAuthenticated } from '../api';
import { VIEWS } from './config';

export const LoadableLogin = Loadable({
  loader: () => import('../layouts/Login'),
  loading: Loading
});

class LoginRoute extends React.Component {
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

    if (view === VIEWS.Dashboard) {
      return <Redirect to={{ pathname: '/' }} />;
    }
    if (view === VIEWS.Login) {
      return <LoadableLogin {...this.props} />;
    }
    return <Loading />;
  }
}

export default LoginRoute;
