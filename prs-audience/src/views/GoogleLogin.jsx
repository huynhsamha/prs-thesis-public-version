import React from 'react';
import { Redirect } from 'react-router-dom';
import Notify from 'react-notification-alert';

import 'react-notification-alert/dist/animate.css';
import '../assets/scss/users/google-login-page.scss';

import { loginByGoogle } from '../api';

class GoogleLoginPage extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Personal Response System';

    this.state = {
      loading: false,
      routeToFeedbackForm: false
    };
  }

  handleLoginGoogle = () => {
    this.setState({
      loading: true
    });
    loginByGoogle();
  };

  onFailure = err => {
    console.log(err);
  };

  renderButtonLogin() {
    return (
      <div>
        <button
          className="btn btn-block btn-danger"
          style={{ height: 40, padding: 0 }}
          onClick={this.handleLoginGoogle}
        >
          <span className="d-flex justify-content-center align-items-center">
            <img
              src="/img/google.png"
              alt="Google"
              width="24"
              className="mr-2 mb-0 mt-0"
            />
            Login or Sign Up with Google
          </span>
        </button>
      </div>
    );
  }

  renderButtonLoading() {
    return (
      <div>
        <button
          className="btn btn-block btn-danger"
          disabled
          style={{ height: 40 }}
        >
          <div className="fa-2x">
            <i className="fas fa-circle-notch fa-spin" />
          </div>
        </button>
      </div>
    );
  }

  render() {
    if (this.state.routeToFeedbackForm) {
      return <Redirect to={'/d/123'} />;
    }
    return (
      <div className="input-code">
        <Notify ref="notify" />
        <div className="layer" />
        <form
          onSubmit={ev => {
            ev.preventDefault();
          }}
        >
          <img
            src={require('../assets/img/brand.png')}
            width="100%"
            alt="Brand"
            style={{ marginBottom: 0 }}
          />
          <div style={{ marginBottom: 20 }}>
            {this.state.loading
              ? this.renderButtonLoading()
              : this.renderButtonLogin()}
            <div className="mt-3 text-center">
              <a href="/policy">Privacy Policy</a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default GoogleLoginPage;
