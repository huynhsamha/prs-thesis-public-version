import React from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loading from '../layouts/Loading';

import { VIEWS } from './config';

export const LoadableComponent = Loadable({
  loader: () => import('../layouts/GoogleLogin'),
  loading: Loading
});

class GoogleLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.GoogleLogin
    };
  }

  render() {
    const { view } = this.state;

    if (view === VIEWS.GoogleLogin) {
      return <LoadableComponent {...this.props} />;
    }
    return <Loading />;
  }
}

export default GoogleLogin;
