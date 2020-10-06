import React from 'react';
import { Redirect } from 'react-router-dom';
import Notify from 'react-notification-alert';

import 'react-notification-alert/dist/animate.css';
import '../assets/scss/login.scss';

import { login } from '../api';
import { alertError } from '../utils/customAlert';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'PRS Administration | Authentication Portal';

    this.state = {
      authenticated: false,
      username: '',
      password: '',
      loading: false
    };
  }

  errorForm = () => {
    return this.state.username === '' || this.state.password === '';
  };

  showWarning = message => {
    this.refs.notify.notificationAlert({
      place: 'tc',
      message,
      type: 'danger',
      icon: 'fa fa-exclamation-triangle '
    });
  };

  login = () => {
    const { username, password } = this.state;
    if (this.errorForm()) {
      this.showWarning('Vui lòng điền đầy đủ username và password');
      return;
    }
    this.setState({ loading: true });
    login({ username, password })
      .then(() => this.setState({ loading: false, authenticated: true }))
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
        setTimeout(() => {
          alertError('Username hoặc password không đúng');
        }, 100);
      });
  };

  render() {
    if (this.state.authenticated) {
      return <Redirect to="/admin" />;
    }

    return (
      <div className="login-page">
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
          />
          <hr />
          <div className="text-center mb-3">
            <h4>Administration</h4>
          </div>
          <div className="form-group login-form-input-group">
            <label>
              <i className="fa fa-user" />
            </label>
            <input
              type="text"
              className="form-control has-error"
              placeholder="Username"
              onChange={ev => this.setState({ username: ev.target.value })}
            />
          </div>
          <div className="form-group login-form-input-group">
            <label>
              <i className="fa fa-key" />
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={ev => this.setState({ password: ev.target.value })}
            />
          </div>
          {!this.state.loading ? (
            <button
              type="submit"
              className="btn btn-block btn-danger"
              onClick={this.login}
              style={{ height: 40 }}
            >
              Đăng nhập
            </button>
          ) : (
            <button
              className="btn btn-block btn-danger"
              disabled
              style={{ height: 40 }}
            >
              <div className="fa-2x">
                <i className="fas fa-circle-notch fa-spin" />
              </div>
            </button>
          )}
        </form>
        {/* <div className="login-footer">
          &copy; {1900 + new Date().getYear()}. All rights reserved.
        </div> */}
      </div>
    );
  }
}
