import React from 'react';
import { Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loading from '../layouts/Loading';

import { VIEWS } from './config';
import { isAuthenticated } from '../api';
import { setCallbackUrl } from '../utils/storage';

export const LoadableComponent = Loadable({
  loader: () => import('../layouts/UserFeedbackForm'),
  loading: Loading
});

class UserFeedbackFormRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.Loading
    };

    isAuthenticated()
      .then(() => {
        this.setState({ view: VIEWS.UserFeedbackForm });
      })
      .catch(err => {
        this.setState({ view: VIEWS.Login });
      });
  }

  render() {
    const { view } = this.state;

    if (view === VIEWS.Login) {
      setCallbackUrl(window.location.href);
      return <Redirect to={{ pathname: '/login' }} />;
    }
    if (view === VIEWS.UserFeedbackForm) {
      return <LoadableComponent {...this.props} />;
    }
    return <Loading />;
  }
}

export default UserFeedbackFormRoute;
