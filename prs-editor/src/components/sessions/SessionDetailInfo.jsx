import React from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { Tag, Icon } from '../../antd';

import { withNamespaces } from 'react-i18next';

import * as apiService from '../../api';
import { labelColors, appColors } from '../../utils/constant';

import { Row, Col } from 'reactstrap';

momentDurationFormatSetup(moment);

class SessionDetailInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      poll: {}
    };
  }

  componentWillMount() {
    this.getPollDetail(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getPollDetail(nextProps);
  }

  getPollDetail(props) {
    const { session } = props;
    if (!session || !session._id || !session.pollID) return;
    apiService
      .getOnePoll(session.pollID)
      .then(data => data.data)
      .then(data => {
        console.log(data);
        this.setState({ poll: data });
      });
  }

  render() {
    const { t, session } = this.props;
    const ss = session || {};

    const poll = this.state.poll || {};

    return (
      <div className="mb-3">
        <h5>{t('title.session-info')}</h5>
        <div className="mt-4">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">{t('session-name')}:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>{ss.title}</span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">Loại session:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              {ss.isPublic ? (
                <span>
                  <Icon
                    type="global"
                    style={{
                      color: appColors.success,
                      fontSize: 18,
                      marginRight: 10
                    }}
                  />
                  Public
                </span>
              ) : ss.usePassword == true ? (
                <span>
                  <Icon
                    type="security-scan"
                    style={{
                      color: appColors.danger,
                      fontSize: 18,
                      marginRight: 10
                    }}
                  />
                  Secure Private Session (Require Password)
                </span>
              ) : (
                    <span>
                      <Icon
                        type="unlock"
                        style={{
                          color: appColors.warning,
                          fontSize: 18,
                          marginRight: 10
                        }}
                      />
                  Private Session (No Password)
                    </span>
                  )}
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">{t('poll')}:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>
                <a href={'/polls/' + poll._id} target="__blank">
                  {poll.title}
                </a>
              </span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">Loại câu hỏi:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>
                <Tag color={labelColors[poll.surveyOrQuiz]} className="mr-3">
                  {t(poll.surveyOrQuiz)}
                </Tag>
                <Tag color={labelColors[poll.quickOrFull]} className="mr-3">
                  {t(poll.quickOrFull)}
                </Tag>
              </span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">Thời điểm bắt đầu:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>{moment(ss.activeTime).format('DD/MM/YYYY HH:mm ')}</span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">Thời điểm kết thúc:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>{moment(ss.finishTime).format('DD/MM/YYYY HH:mm ')}</span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">
                {t('duration')} ( <code>HH:mm:ss</code> ):
              </h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <code>
                {moment.duration(ss.duration || 0).format('HH:mm:ss')}
              </code>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">{t('createdAt')}:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>{moment(ss.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">{t('updatedAt')}:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              <span>{moment(ss.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">Sử dụng tính năng Blockchain:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              {ss.allowBlockchain ? (
                <Tag color={appColors.success} className="mr-3">
                  Cho phép lưu trữ Blockchain
                </Tag>
              ) : (
                  <Tag color={appColors.danger} className="mr-3">
                    Khảo sát thông thường
                  </Tag>
                )}
            </Col>
          </Row>
        </div>
        <div className="mt-3">
          <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
              <h6 className="d-inline mr-2">{t('status')}:</h6>
            </Col>
            <Col xs={12} sm={12} md={9} lg={9}>
              {ss.isComplete ? (
                <Tag color={appColors.danger} className="mr-3">
                  {t('finished')}
                </Tag>
              ) : ss.isActive ? (
                <Tag color={appColors.blue} className="mr-3">
                  {t('active')}
                </Tag>
              ) : (
                    <Tag color={appColors.success} className="mr-3">
                      {t('inactive')}
                    </Tag>
                  )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(SessionDetailInfo);
