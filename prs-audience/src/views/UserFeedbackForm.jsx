import React from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

import Loading from '../components/HorizontalLoading';

import 'react-notification-alert/dist/animate.css';
import '../assets/scss/users/feedback.scss';

import { Button, Radio, Input, Checkbox, Form } from '../antd';

import * as apiService from '../api';
import * as eth from '../api/eth';
import PageNotFound from './PageNotFound';
import {
  confirmWarning,
  alertSuccess,
  alertSuccessHTML
} from '../utils/customAlert';
import { alertError } from '../utils/customAlert';
import { contractAddress } from '../api/eth';
import { forceGetProfile, getEtherPrivatekey, getMyProfile, storeEtherPrivateKey } from '../utils/storage';
import * as drive from '../api/drive';
import { Link } from 'react-router-dom';

class UserFeedbackForm extends React.Component {
  constructor(props) {
    super(props);

    const { code } = this.props.match.params;

    this.state = {
      sessionCode: code,
      pageNotFound: false,
      loading: true,
      session: {},
      poll: {},
      answer: [],
      messageNotFound: '',
      delay: moment.duration(),
      willBeStart: false,
      completeSubmit: false,
      requirePassword: false,
      password: '',
      passwordChanged: false,
      passwordBlured: false,
      completedSession: false,
      audienceFeedback: null,
      viewFeedback: false,
      mapFeedbackToAnswer: false,
      canUseBlockchain: null,
      pk: null,
      useBlockchain: false,
      showMessageLoading: false,
      messageLoading: '',
      // answerEth: null,
      answerEth: {
        txHash: null,
        hashContent: null,
        rawContent: null
      },
      initAndLoadGAPI: null,
      ggDrive: {
        filename: null,
        fileId: null,
      },
      allowBlockchain: null
    };

    this.getSessionByCode();
    this.checkHaveETHInCookie();
    // this.makeDemoLoading();
  }

  downloadPkFile(pkFileId) {
    console.log('downloadPkFile');
    drive.downloadFile(pkFileId).then((content) => {
      // console.log(content);
      const { address, privateKey } = content;
      storeEtherPrivateKey({ privateKey })
      this.setState({
        showMessageLoading: false,
      })
      this.handleHaveETHInCookie(privateKey)
    }).catch(err => {
      console.log(err);
      this.setState({
        showMessageLoading: false,
      })
      alertError('Backup file chứa thông tin Private Key của bạn trong Google Drive không còn tồn tại nữa. Vui lòng kiểm trạ lại trong Google Drive. Nếu bạn cần tạo lại tài khoản Etherum mới, vui lòng liên hệ quản trị để reset.')
    })
  }

  handleIfHavePkFileId(pkFileId) {
    console.log('handleIfHavePkFileId');
    if (drive.isSignIn()) {
      console.log('isSignIn');
      this.downloadPkFile(pkFileId);
    } else {
      console.log('NOT isSignIn');
      confirmWarning('Ứng dụng cần đăng nhập lại Google Drive để thực hiện các tác vụ đồng bộ Ethereum Account. Bạn có cho phép tác vụ này?').then(ok => {
        if (!ok) {
          this.handleDriveIsNotLogin()
          return;
        }
        // cần login và chờ accept đủ permissions
        this.startListenSignInChanges(() => {
          this.stopListenSignInChanges();
          this.downloadPkFile(pkFileId);
        }, () => {
          this.stopListenSignInChanges();
          this.handleDriveIsNotLogin()
        })
        drive.doSignIn()
      })
    }
  }

  handleDriveIsNotLogin = () => {
    this.setState({
      showMessageLoading: false,
    })
    alertError('Ứng dụng không thể truy cập Google Drive để đồng bộ Private Key của bạn.');
    this.setState({ showLoginGoogleDrive: true })
  }

  getProfile = () => new Promise((resolve, reject) => {
    console.log('forceGetProfile');
    forceGetProfile().then(profile => {
      console.log(profile);
      this.setState({
        ggDrive: {
          fileId: profile.pkFileId
        }
      });
      resolve(profile)

    }).catch(err => {
      console.log(err);
      // alertError('Đã có lỗi trong quá trình lấy profile của bạn')
      reject(err);
    });
  })

  startListenSignInChanges = (onSignIn = () => { }, onSignOut = () => { }) => {
    console.log('startListenSignInChanges');
    drive.listenSignInStatus(isSignIn => {
      console.log('Event isSignIn: ' + isSignIn);
      if (isSignIn) {
        onSignIn();
      } else {
        onSignOut();
      }
    });
  }

  stopListenSignInChanges = () => {
    console.log('stopListenSignInChanges');
    drive.listenSignInStatus(isSignIn => {
    });
  }

  loadAndInitGoogleDrive = () => new Promise((resolve, reject) => {
    console.log('loadAndInitGoogleDrive');
    drive.load(() => {
      drive.initClient().then(() => {
        console.log('Success - loadAndInitGoogleDrive');
        resolve();
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  });

  handleNoETHInCookie() {
    console.log('handleNoETHInCookie');
    this.getProfile().then(profile => {
      this.loadAndInitGoogleDrive().then(() => {
        this.setState({ initAndLoadGAPI: true })
        if (profile.pkFileId) {
          this.handleIfHavePkFileId(profile.pkFileId);
        } else {
          this.handleUserNoETH();
        }
      }).catch(err => {
        this.setState({ initAndLoadGAPI: false })
      })
    })
  }

  handleUserNoETH() {
    console.log('handleUserNoETH');
    this.setState({
      canUseBlockchain: false,
      pk: null
    });
  }

  handleHaveETHInCookie(pk) {
    console.log('handleHaveETHInCookie');
    // console.log(pk);
    this.setState({
      canUseBlockchain: true,
      pk
    });
    eth.configDefaultAccount({ privateKey: pk });
  }

  checkHaveETHInCookie() {
    console.log('checkHaveETHInCookie');
    getEtherPrivatekey()
      .then(pk => {
        if (!pk) {
          this.handleNoETHInCookie();
          return;
        }
        this.handleHaveETHInCookie(pk);
      })
      .catch(err => {
        console.log(err);
        this.handleNoETHInCookie();
      });
  }

  getAudienceFeedbackOfSession = sessionId => {
    apiService.getAudienceFeedbackOfSession({ sessionId }).then(data => {
      console.log(data);
      if (data != null && data.data != null && data.data._id != null) {
        const eth = data.data.eth || {};
        this.setState({
          completeSubmit: true,
          audienceFeedback: data.data.answers || [],
          answerEth: {
            txHash: eth.hashID,
            hashContent: eth.hashContent,
            rawContent: eth.rawContent
          }
        });
      }
    });
  };

  parseSession = session => {
    const _activeTime = new Date(session.activeTime).getTime();
    const _finishTime = new Date(session.finishTime).getTime();
    const now = Date.now();
    session.isActive = _activeTime < now && now < _finishTime;
    session.isComplete = _finishTime <= now;
    session.duration = _finishTime - _activeTime;
    session.isPublic = session.type == 'public';
    return session;
  };

  getSessionByCode() {
    apiService
      .getSessionByCode(this.state.sessionCode)
      .then(data => data.data)
      .then(session => {
        session = this.parseSession(session);
        console.log(session);
        this.setState({
          session
        });

        this.handleAfterFetchSession(session);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          pageNotFound: true,
          messageNotFound: 'Không tìm thấy mã này. Vui lòng thử lại mã khác.'
        });
      });
  }

  handleForSecureSession = session => {
    console.log('secure session');
    this.setState({
      loading: false,
      requirePassword: true
    });
  };

  handleForAccessSession = session => {
    console.log('access session');
    if (session.isComplete == false && session.isActive == false) {
      console.log('incoming session');
      this.handleSessionWillBeStart(session);
      return;
    }
    console.log('get poll');
    this.getPollOfSession(session.pollID);
    if (session.isComplete) {
      console.log('session completed');
      this.setState({
        completedSession: true
      });
    } else {
      console.log('incomplete session');
      if (session.isActive) {
        console.log('session is active');
      }
    }
  };

  handleAfterFetchSession = session => {
    const allowBlockchain = session.allowBlockchain == true;
    console.log('allowBlockchain: ' + allowBlockchain);
    this.setState({ allowBlockchain })

    if (!session.isPublic && session.usePassword) {
      // private session with passwords
      this.handleForSecureSession(session);
    } else {
      this.handleForAccessSession(session);
    }
  };

  handleSessionWillBeStart = session => {
    let activeTimeTS = new Date(session.activeTime).getTime();
    let now = Date.now();
    let delta = activeTimeTS - now;
    let ts = moment.duration(delta, 'milliseconds');
    console.log(ts);
    this.setState({
      loading: false,
      willBeStart: true,
      delay: ts
    });
    this.startCountDown();
  };

  startCountDown() {
    this.counter = setInterval(() => {
      this.state.delay.subtract(1, 'second');
      this.setState({
        delay: this.state.delay
      });
      if (Math.floor(this.state.delay.asSeconds()) <= 0) {
        window.location.reload(); // trick
      }
    }, 1000);
  }

  onClickConfirmPwd = () => {
    if (this.state.password == '') {
      alertError('Password is required');
      return;
    }
    apiService
      .getPollOfSession({
        sessionId: this.state.session._id,
        pollId: this.state.session.pollID,
        password: this.state.password
      })
      .then(data => {
        console.log(data);
        const poll = data.data;
        this.setState({
          loading: true,
          requirePassword: false
        });
        const session = this.state.session;
        if (session.isComplete == false && session.isActive == false) {
          console.log('incoming session');
          this.handleSessionWillBeStart(session);
          return;
        }
        setTimeout(() => {
          this.handleAfterLoadPoll(poll);
        }, 200);
      })
      .catch(err => {
        alertError('Password is incorrect');
        return;
      });
  };

  getPollOfSession(pollID) {
    apiService
      .getPollOfSession({
        sessionId: this.state.session._id,
        pollId: pollID
      })
      .then(data => data.data)
      .then(poll => {
        console.log(poll);
        this.handleAfterLoadPoll(poll);
      })
      .catch(err => {
        this.setState({
          loading: false,
          pageNotFound: true,
          messageNotFound: 'Session này đang bị lỗi. Vui lòng thử lại sau.'
        });
      });
  }

  handleAfterLoadPoll = poll => {
    const answer = {};
    for (let q of poll.questions) {
      if (q.type == 'single') {
        answer[q._id] = null;
      } else if (q.type == 'multiple') {
        answer[q._id] = [];
      } else {
        answer[q._id] = '';
      }
    }
    // console.log(answer);
    this.setState({
      poll,
      answer,
      loading: false
    });

    this.getAudienceFeedbackOfSession(this.state.session._id);
  };

  mapAudienceFeedbackToAnswer() {
    const answer = this.state.answer;
    const fb = this.state.audienceFeedback;
    const audAnswers = Object.keys(fb);
    audAnswers.forEach(qid => {
      const val = fb[qid];
      answer[qid] = val;
    });
    this.setState({ answer, mapFeedbackToAnswer: true });
  }

  renderSingle(q) {
    return (
      <>
        <Radio.Group
          value={this.state.answer[q._id]}
          style={{ marginLeft: 10 }}
          onChange={ev => this.onChangeAnswer(q._id, ev.target.value)}
        >
          {q.choices.map(o => {
            return (
              <Radio
                key={o.id}
                style={{
                  display: 'block',
                  marginTop: 5,
                  whiteSpace: 'pre-wrap'
                }}
                value={o.id}
              >
                {o.value}
              </Radio>
            );
          })}
        </Radio.Group>
      </>
    );
  }

  renderMultiple(q) {
    return (
      <>
        <Checkbox.Group
          value={this.state.answer[q._id]}
          onChange={value => this.onChangeAnswer(q._id, value)}
        >
          {q.choices.map(o => {
            return (
              <Checkbox
                key={o.id}
                style={{
                  display: 'block',
                  marginTop: 5,
                  whiteSpace: 'pre-wrap',
                  marginLeft: 10
                }}
                value={o.id}
              >
                {o.value}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </>
    );
  }

  renderText(q) {
    return (
      <>
        <Input
          style={{ marginTop: 10, marginBottom: 10 }}
          value={this.state.answer[q._id]}
          onChange={ev => this.onChangeAnswer(q._id, ev.target.value)}
          placeholder="Câu trả lời từ người dùng"
        />
      </>
    );
  }

  onClickViewFeedback = () => {
    if (this.state.audienceFeedback == null) {
      apiService
        .getAudienceFeedbackOfSession({ sessionId: this.state.session._id })
        .then(data => {
          console.log(data);
          if (data != null && data.data != null && data.data._id != null) {
            this.setState({
              completeSubmit: true,
              audienceFeedback: data.data.answers || []
            });
            setTimeout(() => {
              this.mapAudienceFeedbackToAnswer();
            }, 200);
          }
        });
    } else {
      this.mapAudienceFeedbackToAnswer();
    }
    this.setState({
      viewFeedback: true
    });
  };

  onChangeAnswer = (qid, value) => {
    // console.log(qid, value);
    if (this.state.completeSubmit) {
      return;
    }
    const answer = this.state.answer;
    answer[qid] = value;
    this.setState({
      answer
    });
  };

  onClickSubmit = () => {
    console.log(this.state.answer);
    console.log(this.state.useBlockchain);
    confirmWarning('Bạn chắc chắn muốn gửi phản hồi này?').then(ok => {
      if (!ok) return;
      this.submit();
    });
  };

  continueBlockchain({ md5, feedbackId, txId }) {
    console.log('continueBlockchain');
    this.setState({
      showMessageLoading: true,
      messageLoading: 'Ghi nhận blockchain...'
    });
    getMyProfile()
      .then(profile => profile.email)
      .then(email => {
        eth
          .makeTransaction({
            feedbackId,
            answerHash: md5,
            email,
            sessionId: this.state.session._id,
            feedbackTimestamp: Date.now()
          })
          .then(data => {
            console.log(data);
            const { txHash } = data;
            apiService
              .linkFeedbackTxHash({ txHash, txId })
              .then(() => {
                this.setState({
                  showMessageLoading: false,
                  messageLoading: ''
                });
                alertSuccessHTML(`
              <div>Phản hồi đã được ghi nhận</div>
              <b>Transaction Hash: </b>
              <a href="https://ropsten.etherscan.io/tx/${txHash}" target="_blank">
              ${eth.minimizeTxHash(txHash)}
              </a>`).then(() => {
                  window.location.reload();
                });
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  submit() {
    apiService
      .audienceCreateFeedback({
        sessionId: this.state.session._id,
        answers: this.state.answer,
        password: this.state.password,
        storeOnBlockchain: this.state.useBlockchain
      })
      .then(data => {
        console.log(data);
        if (!this.state.useBlockchain) {
          alertSuccess('Phản hồi của bạn đã được ghi nhận').then(ok => {
            this.setState({ completeSubmit: true });
          });
        } else {
          const { blockchain, feedbackId } = data;
          const { md5, txId } = blockchain || {};
          if (!md5 || !feedbackId || !txId) {
            alertError('Đã có lỗi trong quá trình lưu trữ Blobkchain.');
            this.setState({ completeSubmit: true });
          } else {
            this.continueBlockchain({ md5, feedbackId, txId });
          }
        }
      })
      .catch(err => {
        console.log(err.response);
        alertError(err.response.data.error);
      });
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

  renderCompleteSubmit() {
    return (
      <>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className="mt-4 text-center pb-4">
            <h4>Kết quả phản hồi đã được ghi nhận</h4>
            <br />
            <Link to="/">
              <Button
                type="primary"
                className="btn-block"
              >
                Trở về trang chủ
             </Button>
            </Link>
            <div className="mt-3"></div>
            {this.state.viewFeedback == false && (
              <Button
                type="default"
                className="btn-block"
                onClick={() => {
                  this.onClickViewFeedback();
                }}
              >
                Xem lại phản hồi của bạn
              </Button>
            )}
            <br />
          </div>
        </Col>
        {this.state.viewFeedback && (
          <>
            <Col xs={12} sm={12} md={12} lg={12} className="pb-2 text-center">
              <h5>Phản hồi của bạn</h5>
            </Col>
            {this.state.mapFeedbackToAnswer == false ? (
              <Col xs={12} sm={12} md={12} lg={12} className="pb-4">
                <Loading visible={true} />
              </Col>
            ) : (
                this.renderMyFeedback()
              )}
          </>
        )}
      </>
    );
  }

  renderMyFeedback() {
    const { session, poll } = this.state;
    return (
      <>
        {poll.questions.map((q, idx) => {
          return (
            <Col xs={12} sm={12} md={12} lg={12} key={q._id}>
              <div style={{ marginTop: 16 }}>
                <div className="mb-2 mt-1 ml-1 ow">
                  <b className="overflow-break-word">
                    Câu {idx + 1}. {q.title}
                  </b>
                </div>
                {q.type === 'single'
                  ? this.renderSingle(q)
                  : q.type === 'multiple'
                    ? this.renderMultiple(q)
                    : this.renderText(q)}
              </div>
            </Col>
          );
        })}
        <Col xs={12} sm={12} md={12} lg={12} className="mt-5">
          <hr />
          {this.state.answerEth && this.state.answerEth.txHash && (
            <div>
              <div className="mb-3">
                Phản hồi đã được ghi nhận trên Blockchain
              </div>
              <b>Transaction Hash: </b>
              <div className="mb-2">
                <a
                  href={
                    'https://ropsten.etherscan.io/tx/' +
                    this.state.answerEth.txHash
                  }
                  target="_blank"
                >
                  {eth.minimizeTxHash(this.state.answerEth.txHash)}
                </a>
              </div>
              <b>Smart Contract Address: </b>
              <div className="mb-3">
                <a
                  href={
                    'https://ropsten.etherscan.io/address/' + contractAddress
                  }
                  target="_blank"
                >
                  {eth.minimizeTxHash(contractAddress)}
                </a>
              </div>
              <b className="mb-1">Raw Content:</b>
              <Input.TextArea
                readOnly
                style={{ height: 120, width: '100%' }}
                value={this.state.answerEth.rawContent}
                className="mb-3"
              />
              <b className="mb-1">MD5 Hash Content:</b>
              <Input
                type="text"
                readOnly
                value={this.state.answerEth.hashContent}
                style={{ width: '100%' }}
                className="mb-3"
              />
              <a href="/converter" target="_blank">Mở công cụ chuyển đổi dữ liệu (Text/Hex/Bytes)</a>
            </div>
          )}
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pb-4"></Col>
      </>
    );
  }

  renderCompletedSession() {
    return (
      <Col xs={12} sm={12} md={12} lg={12}>
        <div className="mt-4 text-center">
          <h4>Session này đã kết thúc</h4>
        </div>
      </Col>
    );
  }

  renderCompletedSessionWithoutFeedback() {
    return (
      <>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className="mt-4 text-center pb-4">
            <br />
            <Button
              type="primary"
              className="btn-block"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Trở về trang chủ
            </Button>
          </div>
        </Col>
      </>
    );
  }

  renderRequirePassword() {
    const { session, poll } = this.state;
    return (
      <>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="text-center">
              <h4>Session này đã được bảo vệ bằng mật khẩu</h4>
              <h4>Vui lòng nhập mật khẩu để truy cập</h4>
            </div>
            <hr />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className="mt-4 pb-4">
              <Form className="mt-3">
                <Form.Item className="mt-3">
                  <Input.Password
                    style={{ width: '100%' }}
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="false"
                    onChange={e => {
                      this.setState({
                        password: e.target.value,
                        passwordChanged: true
                      });
                    }}
                    onBlur={e => {
                      this.setState({
                        passwordBlured: true
                      });
                    }}
                    allowClear
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.onClickConfirmPwd}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
  }

  renderWillBeStart() {
    const { session, poll } = this.state;
    return (
      <>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className="mt-4 text-center pb-4">
            <b className="text-center">
              <i
                style={{
                  fontSize: '20px',
                  color: 'rgb(57, 57, 57)'
                }}
              >
                Session sẽ được bắt đầu sau
              </i>
            </b>
          </div>
          <div
            style={{
              fontSize: '26px',
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '10px',
              color: 'rgb(57, 57, 57)'
            }}
          >
            {this.renderDurationCountdown(this.state.delay)}
          </div>
        </Col>
      </>
    );
  }

  renderOptionUseBlockchain() {
    return (
      <div>
        <p className="mt-3">
          <b>Gợi ý: </b>
          <i>Bạn có muốn lưu trữ phản hồi của bạn trên Blockchain?</i>
        </p>
        <div className="">
          <Checkbox.Group
            value={[this.state.useBlockchain]}
            onChange={value => {
              this.setState({ useBlockchain: value[0] });
            }}
          >
            <Checkbox
              style={{
                display: 'block',
                marginTop: 5,
                whiteSpace: 'pre-wrap',
                marginLeft: 10
              }}
              value={true}
            >
              Lưu phản hồi vào Blockchain.
            </Checkbox>
          </Checkbox.Group>
        </div>
      </div>
    );
  }

  onClickCreate = () => {
    confirmWarning(
      `Bạn có muốn chuyển hướng để tạo tài khoản Etherum?
Những lựa chọn của bạn sẽ không được lưu lại do đó cân nhắc trước hành động này.
Bạn vẫn có thể submit phản hồi của bạn mà không cần tài khoản Ethereum.
`
    ).then(ok => {
      if (!ok) return;
      window.location.href = "/me"
    });
  };

  renderQuestionCreateBlockchainAccount() {
    return (
      <div>
        <p className="mt-3">
          <b>Gợi ý: </b>
          <i>
            Hiện tại bạn chưa kích hoạt tài khoản Blockchain. Hệ thống sử dụng
            nền tảng Blockchain Ethereum. Bạn có thể kích hoạt chức năng này và
            mỗi phản hồi của bạn đều có thể được ghi nhận vào Blockchain nhằm
            đảm bảo tính minh bạch.
          </i>
        </p>
        <div className="mt-4">
          <Button
            type="danger"
            className="btn-block"
            onClick={this.onClickCreate}
          >
            Tạo tài khoản Ethereum
          </Button>
        </div>
      </div>
    );
  }

  renderFormQuestions() {
    const { session, poll } = this.state;
    return (
      <>
        {poll.questions.map((q, idx) => {
          return (
            <Col xs={12} sm={12} md={12} lg={12} key={q._id}>
              <div style={{ marginTop: 16 }}>
                <div className="mb-2 mt-1 ml-1">
                  <b className="overflow-break-word">
                    Câu {idx + 1}. {q.title}
                  </b>
                </div>
                {q.type === 'single'
                  ? this.renderSingle(q)
                  : q.type === 'multiple'
                    ? this.renderMultiple(q)
                    : this.renderText(q)}
              </div>
            </Col>
          );
        })}
        {this.state.allowBlockchain &&
          <Col xs={12} sm={12} md={12} lg={12} className="mt-3">
            {this.state.canUseBlockchain == true
              ? this.renderOptionUseBlockchain() : this.state.canUseBlockchain == false
                ? this.renderQuestionCreateBlockchainAccount()
                : <Loading visible={true} />
            }
          </Col>
        }
        <Col xs={12} sm={12} md={12} lg={12} className="mt-3 mb-4">
          <Button
            className="btn-block mt-3"
            type="primary"
            onClick={this.onClickSubmit}
          >
            Submit
          </Button>
        </Col>
      </>
    );
  }

  makeDemoLoading() {
    setTimeout(() => {
      this.setState({
        showMessageLoading: true,
        messageLoading: 'Ghi nhận phản hồi...'
      });
      setTimeout(() => {
        this.setState({
          showMessageLoading: true,
          messageLoading: 'Ghi nhận blockchain...'
        });
        setTimeout(() => {
          this.setState({
            showMessageLoading: false,
            messageLoading: ''
          });
          alertSuccessHTML(`
          <div>Phản hồi đã được ghi nhận</div>
          <b>Transaction Hash: </b>
          <a href="https://ropsten.etherscan.io/address/0x5891b3a6ac6135a937f7198769bcf1be12eeb612" target="_blank">
            0x5891b3a6ac6135a937f7198769bcf1be12eeb612
          </a>`).then(() => {
            window.location.reload();
          });
        }, 1000);
      }, 1000);
    }, 200);
  }

  renderMessageLoading() {
    return (
      <LoadingOverlay
        active={this.state.showMessageLoading}
        spinner
        text={this.state.messageLoading}
      ></LoadingOverlay>
    );
  }

  render() {
    if (this.state.loading) {
      return <Loading visible={this.state.loading} />;
    }
    if (this.state.pageNotFound) {
      return <PageNotFound message={this.state.messageNotFound} />;
    }

    const { session, poll } = this.state;
    return (
      <>
        <div className="feedback-form">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="main-content">
                  {this.state.requirePassword ? (
                    this.renderRequirePassword()
                  ) : (
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <h4>{session.title}</h4>
                          <hr />
                        </Col>
                        {this.state.willBeStart ? (
                          this.renderWillBeStart() // only count down element
                        ) : (
                            <>
                              {this.state.completedSession ? (
                                this.renderCompletedSession()
                              ) : (
                                  <></>
                                )}
                              {this.state.completeSubmit // user sent feedback before
                                ? this.renderCompleteSubmit()
                                : this.state.completedSession
                                  ? this.renderCompletedSessionWithoutFeedback()
                                  : this.renderFormQuestions()}
                            </>
                          )}
                      </Row>
                    )}
                  {this.state.showMessageLoading && this.renderMessageLoading()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserFeedbackForm;
