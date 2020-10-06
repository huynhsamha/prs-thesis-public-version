import React from 'react';
import moment from 'moment';
import {
  Button,
} from '../../antd';

import QRCode from 'qrcode.react';

import { appColors } from '../../utils/constant';
import { userPath } from '../../config';

class SessionDetailActive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      delay: moment.duration(),
      remainTime: moment.duration(),

      willBeStart: false,
      started: false,
      ended: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { session } = nextProps;
    const ss = session || {};

    if (!ss.isComplete) {
      console.log('Incomplete');
      let activeTimeTS = new Date(ss.activeTime).getTime();
      let now = Date.now();
      let delta = activeTimeTS - now;
      let remainTime = activeTimeTS + ss.duration - now;
      if (ss.isActive) {
        console.log('Active');
        if (remainTime > 0) {
          let ts = moment.duration(remainTime, 'milliseconds');
          this.setState({
            willBeStart: false,
            started: true,
            ended: false,
            remainTime: ts
          });
          this.startCountDownRemainTime();
        } else {
          this.setState({
            willBeStart: false,
            started: false,
            ended: true
          });
        }
      } else {
        console.log('Inactive');
        let ts = moment.duration(delta, 'milliseconds');
        this.setState({
          willBeStart: true,
          started: false,
          ended: false,
          delay: ts
        });
        this.startCountDown();
      }
    } else {
      console.log('Completed');
      this.setState({
        willBeStart: false,
        started: false,
        ended: true
      });
    }
  }

  startCountDownRemainTime() {
    if (this.counter != null) return;
    this.counter = setInterval(() => {
      this.state.remainTime.subtract(1, 'second');
      this.setState({
        remainTime: this.state.remainTime
      });
      if (this.parseDurationToSecond(this.state.remainTime) == 0) {
        window.location.reload(); // trick
      }
    }, 1000);
  }

  startCountDown() {
    if (this.counter != null) return;
    this.counter = setInterval(() => {
      this.state.delay.subtract(1, 'second');
      this.setState({
        delay: this.state.delay
      });
      if (this.parseDurationToSecond(this.state.delay) == 0) {
        window.location.reload(); // trick
      }
    }, 1000);
  }

  stopCountDown() {
    clearInterval(this.counter);
  }

  renderDurationCountdown(duration) {
    return (
      <b>
        <i>
          {duration.days() > 0 && (
            <>
              <code className="ml-2 mr-1">{duration.days()}</code>
              ngày
            </>
          )}
          {duration.hours() > 0 && (
            <>
              <code className="ml-2 mr-1">{duration.hours()}</code>
              giờ
            </>
          )}
          <code className="ml-2 mr-1">{duration.minutes()}</code>
          phút
          <code className="ml-2 mr-1">{duration.seconds()}</code>
          giây
        </i>
      </b>
    );
  }

  renderWhenSessionActive() {
    const { session } = this.props;
    const ss = session || {};
    return (
      <div>
        <div className="mt-3">
          {this.state.started && (
            <>
              <div>
                <b>
                  <i style={{ fontSize: '24px' }}>Session sẽ kết thúc sau</i>
                </b>
              </div>
              <div
                style={{
                  fontSize: '30px',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                {this.renderDurationCountdown(this.state.remainTime)}
              </div>
            </>
          )}
          {this.state.ended && (
            <>
              <div>
                <b>
                  <i>Session đã kết thúc</i>
                </b>
              </div>
            </>
          )}
        </div>
        {this.state.ended && (
          <div className="mt-5 text-center">
            <Button
              style={{ backgroundColor: appColors.success, color: '#fff' }}
              icon="desktop"
              className="text-white mr-3"
              size="large"
              onClick={() => { }}
            >
              Coming soon
            </Button>
          </div>
        )}
      </div>
    );
  }

  renderQrAndButton() {
    const { session } = this.props;
    const ss = session || {};
    return (
      <div>
        {(this.state.started || this.state.willBeStart) && (
          <>
            <div className="mt-5 text-center">
            </div>
            <div className="mt-5 row">
              <div className="col-12 col-md-6 text-center">
                <h4>Nhập mã PIN</h4>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    minHeight: '168px'
                  }}
                >
                  {(ss.code || '').split('').map((c, i) => {
                    return (
                      <span key={i} className="digit">
                        {c}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="col-12 col-md-6 text-center">
                <h4>Quét mã QR</h4>
                <QRCode
                  value={this.getQrContent()}
                  size={168}
                  includeMargin={true}
                  id="qrcode"
                  onContextMenu={e => {
                    e.preventDefault();
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  getQrContent = () => {
    return userPath + '/d/' + this.props.session.code;
  };

  openPresentMode = () => { };

  renderWhenSessionInactive() {
    return (
      <div>
        <div className="mt-3">
          {this.state.willBeStart && (
            <>
              <div>
                <b>
                  <i style={{ fontSize: '24px' }}>
                    Session sẽ được bắt đầu sau
                  </i>
                </b>
              </div>
              <div
                style={{
                  fontSize: '30px',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                {this.renderDurationCountdown(this.state.delay)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  parseDurationToSecond(duration) {
    return Math.floor(duration.asSeconds());
  }

  renderComplete() {
    return <div></div>;
  }

  render() {
    const { session } = this.props;
    const ss = session || {};

    if (ss.isComplete) {
      return <div />;
    }

    return (
      <div className="mb-3">
        <div className="mt-2">
          {ss.isComplete
            ? this.renderComplete()
            : ss.isActive
              ? this.renderWhenSessionActive()
              : this.renderWhenSessionInactive()}

          {!ss.isComplete && this.renderQrAndButton()}
        </div>
      </div>
    );
  }
}

export default SessionDetailActive
