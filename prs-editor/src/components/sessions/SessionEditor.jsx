import React from 'react';
import moment from 'moment';
import qs from 'qs';
import {
  Button,
  Steps,
  Icon,
  Form,
  Input,
  Select,
  Tag,
  Switch,
  DatePicker,
  notification
} from '../../antd';

import { withNamespaces } from 'react-i18next';

import * as apiService from '../../api';
import { labelColors, appColors } from '../../utils/constant';
import { filterSelectAntd } from '../../utils/rTableConfig';
import {
  confirmWarning,
  alertSuccess,
  alertError
} from '../../utils/customAlert';

const { RangePicker } = DatePicker;

const openNotificationWithIcon = ({ type, title, message }) => {
  notification[type]({
    message: title,
    description: message,
    duration: 3
  });
};

const { Step } = Steps;
const { Option } = Select;

class SessionEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      password: '',
      isPublic: true,
      usePassword: false,
      polls: [],
      startTime: moment().add(5, 'minute'),
      endTime: moment()
        .add(1, 'day')
        .add(5, 'minute'),
      selectedPollId: null,
      autoTitle: true,
      allowBlockchain: true
    };

    let search = this.props.location.search;
    if (search && search != '') {
      search = search.split('?');
      if (search.length > 1) {
        search = search[1];
        const q = qs.parse(search);
        if (q.pollID && q.pollID != '') {
          this.initPollID = q.pollID;
        }
      }
    }
  }

  componentWillReceiveProps(props) {
    const { type, session } = props;
    if (type == 'update' && session != null && session.pollID && session._id) {
      const { activeTime, finishTime, duration } = session;

      this.setState({
        type: 'update',
        sessionID: session._id,
        title: session.title,
        isPublic: session.type == 'public',
        selectedPollId: session.pollID,
        autoTitle: false,
        startTime: moment(activeTime),
        endTime: moment(finishTime),
        password: session.password,
        usePassword: session.usePassword,
        allowBlockchain: session.allowBlockchain
      });
    }
  }

  componentWillMount() {
    this.getPolls();
  }

  getPolls = () => {
    apiService.getMyPoll().then(res => {
      // console.log(res.data);
      const polls = res.data;
      this.setState({
        polls: polls || []
      });
      const exist = polls.findIndex(u => u._id == this.initPollID) > -1;
      if (this.state.type != 'update' && exist) {
        this.setState({
          selectedPollId: this.initPollID
        });
        this.autoGenTitle(this.state.selectedPollId);
      }
    });
  };

  renderAllowBlockchain() {
    return (
      <div className="mt-3">
        <Switch
          checked={this.state.allowBlockchain}
          onChange={checked => {
            this.setState({ allowBlockchain: checked });
          }}
        />
        <span className="text-dark ml-3 mt-3">
          Tính năng cho phép người dùng lưu trữ phản hồi của họ trên nền tảng Blockchain.
        </span>
      </div>
    );
  }

  renderTitleSession() {
    const { t } = this.props;
    return (
      <>
        <Form className="mt-3">
          <Form.Item
            validateStatus={
              !this.state.titleChanged || !this.state.titleBlured
                ? ''
                : this.state.title !== ''
                  ? 'success'
                  : 'error'
            }
            className="mt-3"
          >
            <Input
              style={{ width: '100%' }}
              value={this.state.title}
              onChange={e => {
                this.setState({
                  title: e.target.value,
                  titleChanged: true
                });
              }}
              onBlur={e => {
                this.setState({
                  titleBlured: true
                });
              }}
              allowClear
              placeholder={t('placeholder.session-name')}
              readOnly={this.state.autoTitle}
            />
          </Form.Item>
          <Switch
            checked={this.state.autoTitle}
            onChange={checked => {
              this.setState({ autoTitle: checked });
              if (checked) {
                // auto gen
                this.autoGenTitle(this.state.selectedPollId);
              }
            }}
          />
          <span className="text-dark ml-3 mt-3">
            <code>Suggest a session name</code>
          </span>
          <div className="mt-3">
            <i>
              <b>Suggest a session name: </b>
              Tự động tạo tên cho session của bạn dựa vào tên bộ câu hỏi và thời
              gian diễn ra session. Disable để có thể tạo tên session theo ý
              bạn.
            </i>
          </div>
        </Form>
      </>
    );
  }

  renderPasswordSession() {
    return (
      <>
        {this.renderSessionUsePassword()}
        {this.state.usePassword == true && (
          <Form className="mt-4" autoComplete="off">
            <Form.Item className="mt-3">
              <Input.Password
                style={{ width: '60%' }}
                name="session-password"
                type="password"
                placeholder="Enter a password"
                autoComplete="off"
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
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
              />
            </Form.Item>
          </Form>
        )}
      </>
    );
  }

  autoGenTitle = (pollID, timeRange) => {
    pollID = pollID || this.state.selectedPollId;
    if (!pollID) return;
    let poll = this.state.polls.find(u => u._id === pollID);
    if (!poll) return;
    let startTime = this.state.startTime;
    let endTime = this.state.endTime;
    if (timeRange) {
      startTime = timeRange[0];
      endTime = timeRange[1];
    }
    let title =
      poll.title + ' - Ngày ' + moment(startTime).format('DD/MM/YYYY');
    this.setState({
      title
    });
  };

  handleChangeSelectPoll = value => {
    this.setState({
      selectedPollId: value
    });
    if (this.state.autoTitle) {
      this.autoGenTitle(value);
    }
  };

  renderSelectPoll() {
    const { t } = this.props;
    return (
      <>
        <div className="mt-2">
          <i>
            Lựa chọn mẫu khảo sát hoặc mẫu kiểm tra từ bộ câu hỏi của bạn. Nếu
            không tìm thấy, vui lòng tạo một bộ câu hỏi trong mục
            <code> Poll Storage </code>.
          </i>
        </div>
        <div className="mt-3">
          <Select
            value={this.state.selectedPollId}
            style={{ width: '100%' }}
            onChange={this.handleChangeSelectPoll}
            showSearch
            filterOption={(input, option) => filterSelectAntd(input, option)}
          >
            {this.state.polls.map(p => (
              <Option
                key={p._id}
                value={p._id}
                data-filter={{
                  title: p.title,
                  quickOrFull: p.quickOrFull,
                  surveyOrQuiz: p.surveyOrQuiz
                }}
              >
                <div className="d-flex justify-content-between">
                  <span className="">{p.title}</span>
                  <span>
                    <Tag color={labelColors[p.surveyOrQuiz]} className="mr-3">
                      {t(p.surveyOrQuiz)}
                    </Tag>
                    <Tag color={labelColors[p.quickOrFull]} className="mr-3">
                      {t(p.quickOrFull)}
                    </Tag>
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>
      </>
    );
  }

  onChangeSessionType = checked => {
    this.setState({
      isPublic: checked
    });
  };

  onChangeSessionPassword = checked => {
    this.setState({
      usePassword: checked
    });
  };

  renderSessionType = () => {
    const { t } = this.props;
    return (
      <>
        <div className="mt-3">
          <Switch
            checked={this.state.isPublic}
            onChange={this.onChangeSessionType}
          />
          <span className="text-dark ml-3 mt-3">
            <code>Public Session</code>
          </span>
        </div>
        <div className="mt-3">
          <Icon
            className="mr-2"
            type="global"
            style={{ color: appColors.success, fontSize: 18 }}
          />
          <i>
            <b>Public Session: </b>
            Đây là loại session được mở public, bất kì người nào tham gia hệ
            thống đều có thể thực hiện phản hồi. Thích hợp cho một mẫu khảo sát
            mở.
          </i>
        </div>
        {this.state.isPublic === false && (
          <>
            <div className="mt-3">
              <Icon
                className="mr-2"
                type="unlock"
                style={{ color: appColors.warning, fontSize: 18 }}
              />
              <i>
                <b>Private Session: </b>
                Đây là loại session được đóng bí mật, không hiển thị trên hệ
                thống. Người dùng có thể tham gia khi quét mã QR hoặc sử dụng mã
                code 6 số để tham gia. Thích hợp cho một mẫu khảo sát kín, không
                cần tính riêng tư cao.
              </i>
            </div>
            <div>{this.renderPasswordSession()}</div>
          </>
        )}
      </>
    );
  };

  renderSessionUsePassword = () => {
    const { t } = this.props;
    return (
      <>
        <div className="mt-3">
          <Switch
            checked={this.state.usePassword}
            onChange={this.onChangeSessionPassword}
          />
          <span className="text-dark ml-3 mt-3">
            <code>Secure Private Session</code>
          </span>
        </div>
        <div className="mt-3">
          <Icon
            className="mr-2"
            type="security-scan"
            style={{ color: appColors.danger, fontSize: 18 }}
          />
          <i>
            <b>Secure Private Session: </b>
            Đặt mật khẩu cho private session giúp bảo vệ việc người khác truy
            cập vào session của bạn khi có mã QR hoặc mã code 6 số. Thích hợp
            cho một mẫu kiểm tra có tính riêng tư cao.
          </i>
        </div>
      </>
    );
  };

  onChangeRangeTime = value => {
    this.setState({
      startTime: value[0],
      endTime: value[1]
    });
    if (this.state.autoTitle) {
      this.autoGenTitle(null, value);
    }
  };

  onOkRangeTime = value => {
    this.setState({
      startTime: value[0],
      endTime: value[1]
    });
  };

  renderRangeTime = () => {
    return (
      <>
        <div className="mt-3">
          <RangePicker
            size="medium"
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            placeholder={['Thời điểm bắt đầu', 'Thời điểm kết thúc']}
            onChange={this.onChangeRangeTime}
            onOk={this.onOkRangeTime}
            value={[this.state.startTime, this.state.endTime]}
            style={{ width: '60%' }}
            disabledDate={cur => {
              return cur < moment.now();
            }}
          />
          <div className="mt-3">
            <i>Chọn thời gian bắt đầu và thời gian kết thúc cho session.</i>
          </div>
        </div>
      </>
    );
  };

  onClickComplete = () => {
    const { t } = this.props;
    const {
      title,
      selectedPollId,
      duration,
      isPublic,
      usePassword,
      password
    } = this.state;
    if (
      !selectedPollId ||
      selectedPollId === null ||
      title === '' ||
      duration === null
    ) {
      openNotificationWithIcon({
        type: 'error',
        title: t('error'),
        message: t('message.alert.missing')
      });
      return;
    }
    if (this.state.type == 'update' && this.state.sessionID) {
      this.handleUpdate();
    } else {
      this.handleCreate();
    }
  };

  parseDurationToSecond(duration) {
    let t = moment(duration);
    return t.hour() * 60 * 60 + t.minutes() * 60 + t.second();
  }

  handleCreate = () => {
    const { t } = this.props;
    confirmWarning(t('message.confirm.createSession')).then(ok => {
      if (!ok) return;
      const data = {
        title: this.state.title,
        isPublic: this.state.isPublic,
        activeTime: this.state.startTime.toDate(),
        finishTime: this.state.endTime.toDate(),
        pollID: this.state.selectedPollId,
        password: this.state.usePassword ? this.state.password : null,
        allowBlockchain: this.state.allowBlockchain ? 'true' : 'false'
      };
      apiService
        .createSession(data)
        .then(() => {
          alertSuccess(t('message.success.createSession')).then(() => {
            window.location.href = '/sessions';
          });
        })
        .catch(err => {
          console.error('Error when create session', err);
          alertError(err.response.data.error);
        });
    });
  };

  handleUpdate = () => {
    const { t } = this.props;
    confirmWarning(t('message.confirm.updateSession')).then(ok => {
      if (!ok) return;
      const data = {
        sessionID: this.state.sessionID,
        title: this.state.title,
        isPublic: this.state.isPublic,
        activeTime: this.state.startTime.toDate(),
        finishTime: this.state.endTime.toDate(),
        pollID: this.state.selectedPollId,
        password: this.state.usePassword ? this.state.password : null,
        allowBlockchain: this.state.allowBlockchain ? 'true' : 'false'
      };
      apiService
        .updateSession(data)
        .then(data => {
          alertSuccess(t('message.success.updateSession')).then(() => {
            window.location.href =
              '/sessions/' + this.state.sessionID + '/detail';
          });
        })
        .catch(err => {
          console.error('Error when create session', err);
          alertError(err.response.data.error);
        });
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div className="">
        <Steps direction="vertical" className="mt-3">
          <Step
            status="finish"
            title={
              <div className="mt-2">
                <h6>Chọn bộ câu hỏi cho session (*)</h6>
              </div>
            }
            description={this.renderSelectPoll()}
            icon={<Icon type="pushpin" />}
            className="mt-2"
          />
          <Step
            status="finish"
            title={
              <div className="mt-2">
                <h6>Chọn loại session (*)</h6>
              </div>
            }
            description={this.renderSessionType()}
            icon={<Icon type="global" />}
            className="mt-2"
          />
          <Step
            status="finish"
            title={
              <div className="mt-2">
                <h6>Chọn tiên đề cho session (*)</h6>
              </div>
            }
            description={this.renderTitleSession()}
            icon={<Icon type="font-colors" />}
            className="mt-2"
          />
          <Step
            status="finish"
            title={
              <div className="mt-2">
                <h6>Chọn khoảng thời gian (*)</h6>
              </div>
            }
            description={this.renderRangeTime()}
            icon={<Icon type="clock-circle" />}
            className="mt-2"
          />
          <Step
            status="finish"
            title={
              <div className="mt-2">
                <h6>Cho phép lưu trữ Blockchain từ người phản hồi</h6>
              </div>
            }
            description={this.renderAllowBlockchain()}
            icon={<Icon type="api" />}
            className="mt-2"
          />
        </Steps>
        <hr />
        <div>
          <Button
            type="danger"
            icon="check"
            onClick={this.onClickComplete}
            style={{ marginLeft: 15 }}
          >
            {t('complete')}
          </Button>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(SessionEditor);
