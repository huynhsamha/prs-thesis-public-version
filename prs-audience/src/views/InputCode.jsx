import React from 'react';
import { Redirect } from 'react-router-dom';
import Notify from 'react-notification-alert';
import ReactCodeInput from 'react-code-input';

import 'react-notification-alert/dist/animate.css';
import '../assets/scss/users/inputcode.scss';

import { getSessionByCode } from '../api';
import { alertError } from '../utils/customAlert';

class InputCode extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Personal Response System';

    this.state = {
      loading: false,
      value: '',
      validNumber: false,
      routeToFeedbackForm: false
    };
  }

  goToFeedbackForm() {
    this.setState({
      routeToFeedbackForm: true
    });
  }

  onChangeInputCode(val) {
    if (val.length == 6) {
      this.setState({
        validNumber: true,
        value: val
      });
    } else {
      this.setState({
        validNumber: false,
        value: val
      });
    }
  }

  handleClickJoin = () => {
    const { value } = this.state;
    let valid = /^\d{6,6}$/.test(value);
    if (!valid) {
      alertError('Định dạng mã không hợp lệ');
      return;
    }
    getSessionByCode(value)
      .then(data => data.data)
      .then(session => {
        console.log(session);
        session = this.parseSession(session);
        if (session.isComplete) {
          alertError('Session này đã kết thúc');
        } else {
          this.goToFeedbackForm();
        }
      })
      .catch(err => {
        console.log(err);
        alertError('Không tìm thấy mã tương tự. Vui lòng kiểm tra lại mã.');
        return;
      });
  };

  parseSession = session => {
    const _activeTime = new Date(session.activeTime).getTime();
    const _finishTime = new Date(session.finishTime).getTime();
    const now = Date.now();
    session.isActive = _activeTime < now && now < _finishTime;
    session.isComplete = _finishTime <= now;
    return session;
  };

  render() {
    if (this.state.routeToFeedbackForm) {
      return <Redirect to={'/d/' + this.state.value} />;
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
          />
          <div className="text-center mb-4">
            <ReactCodeInput
              type="text"
              fields={6}
              inputStyle={{
                MozAppearance: 'textfield',
                borderRadius: '6px',
                border: '1px solid',
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
                margin: '4px',
                paddingLeft: '8px',
                width: '36px',
                height: '42px',
                fontSize: '32px',
                boxSizing: 'border-box',
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'lightgrey'
              }}
              inputMode="numeric"
              onChange={value => this.onChangeInputCode('' + value)}
            />
          </div>
          {this.state.loading ? (
            <button
              className="btn btn-block btn-danger"
              disabled
              style={{ height: 40 }}
            >
              <div className="fa-2x">
                <i className="fas fa-circle-notch fa-spin" />
              </div>
            </button>
          ) : this.state.validNumber ? (
            <button
              type="submit"
              className="btn btn-block btn-danger"
              onClick={this.handleClickJoin}
              style={{ height: 40 }}
            >
              Tham gia
            </button>
          ) : (
            <button
              className="btn btn-block btn-danger"
              disabled
              style={{ height: 40 }}
            >
              Tham gia
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default InputCode;
