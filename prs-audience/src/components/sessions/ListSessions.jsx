import React from 'react';
import moment from 'moment';

import { Icon, Tooltip } from '../../antd';
import { Row, Col } from 'reactstrap';

import { withNamespaces } from 'react-i18next';
import { appColors } from '../../utils/constant';
import { CompareSession } from '../../utils/comparator';
import { Link } from 'react-router-dom';

class ListSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderCard = record => {
    const { t } = this.props;
    return (
      <Col xs={12} md={6} key={record._id}>
        <div
          style={{
            padding: 16,
            backgroundColor: '#f4f3ef',
            borderRadius: 6,
            marginTop: 10
          }}
        >
          <h6>{record.title}</h6>
          <hr />
          <div className="mt-2 d-flex justify-content-between">
            <span>Bắt đầu</span>
            <code>{record.activeTime}</code>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <span>Kết thúc</span>
            <code>{record.finishTime}</code>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <span>Phản hồi lúc</span>
            <code>{record.feedbackAt}</code>
          </div>
          <div className="d-flex justify-content-around mt-4 mb-1">
            <span>
              <Tooltip
                placement="top"
                title={
                  record.isPublic
                    ? 'Public Session'
                    : record.usePassword == true
                      ? 'Secure Private Session (Require Password)'
                      : 'Private Session (No Password)'
                }
              >
                {record.isPublic ? (
                  <Icon
                    type="global"
                    style={{ color: appColors.success, fontSize: 18 }}
                  />
                ) : record.usePassword == true ? (
                  <Icon
                    type="security-scan"
                    style={{ color: appColors.danger, fontSize: 18 }}
                  />
                ) : (
                      <Icon
                        type="unlock"
                        style={{ color: appColors.warning, fontSize: 18 }}
                      />
                    )}
              </Tooltip>
            </span>
            <span>
              <Tooltip
                placement="top"
                title={
                  record.isComplete
                    ? t('complete')
                    : record.isActive
                      ? t('active')
                      : t('inactive')
                }
              >
                {record.isComplete ? (
                  <Icon
                    type="check-circle"
                    style={{ color: appColors.success, fontSize: 18 }}
                  />
                ) : record.isActive ? (
                  <Icon
                    type="sync"
                    style={{ color: appColors.info, fontSize: 18 }}
                  />
                ) : (
                      <Icon
                        type="calendar"
                        style={{ color: appColors.danger, fontSize: 18 }}
                      />
                    )}
              </Tooltip>
            </span>
            {/* <span>
              <Tooltip placement="top" title={'Tham gia phản hồi'}>
                <a onClick={() => { }}>
                  <Icon
                    type="eye"
                    style={{ color: appColors.info, fontSize: 18 }}
                    onClick={() => this.onClickDetail(record)}
                  />
                </a>
              </Tooltip>
            </span> */}
            <span>
              <Tooltip
                placement="top"
                title="Share"
              >
                <Link to={'/qrgen?code=' + record.code}>
                  <Icon type="qrcode" style={{ color: appColors.danger, fontSize: 18 }} />
                </Link>
              </Tooltip>
            </span>
            <span>
              <Tooltip
                placement="top"
                title="Open"
              >
                <Link to={'/d/' + record.code}>
                  <Icon type="login" style={{ color: appColors.info, fontSize: 18 }} />
                </Link>
              </Tooltip>
            </span>
          </div>
        </div>
      </Col>
    );
  };

  onClickDetail = record => {
    window.open('/d/' + record.code);
  };

  parseSessionToDS(sessions) {
    return [...(sessions || [])]
      .map(p => {
        const _activeTime = new Date(p.activeTime).getTime();
        const _finishTime = new Date(p.finishTime).getTime();
        const now = Date.now();

        return {
          _id: p._id,
          title: p.title || 'Đây là một cái tên khá là dài luôn đó',
          activeTime: moment(p.activeTime).format('DD/MM/YYYY HH:mm'),
          finishTime: moment(p.finishTime).format('DD/MM/YYYY HH:mm'),
          isActive: _activeTime < now && now < _finishTime,
          isComplete: _finishTime <= now,
          url: p.url,
          isPublic: p.type == 'public',
          usePassword: p.usePassword,
          feedbackAt: moment(p.feedbackAt).format('DD/MM/YYYY HH:mm'),
          code: p.code,
          activeTS: _activeTime,
          finishTS: _finishTime
        };
      })
      .sort((u, v) => {
        return CompareSession(
          { startTime: u.activeTS, endTime: u.finishTS },
          { startTime: v.activeTS, endTime: v.finishTS }
        );
      });
  }

  render() {
    const { sessions, t } = this.props;
    return (
      <>
        {sessions && (
          <div style={{ marginTop: 2 }}>
            <Row>
              {this.parseSessionToDS(sessions).map(session =>
                this.renderCard(session)
              )}
            </Row>
          </div>
        )}
      </>
    );
  }
}

export default withNamespaces()(ListSessions);
