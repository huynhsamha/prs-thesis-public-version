import React from 'react';
import moment from 'moment';

import { Icon, Tooltip, Tag, Button } from '../../antd';
import { Row, Col } from 'reactstrap';

import { withNamespaces } from 'react-i18next';
import { appColors, labelColors } from '../../utils/constant';
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
          <div className="d-flex justify-content-between mt-4 mb-1">
            <span>
              {record.isComplete ? (
                <Icon
                  type="check-circle"
                  style={{ color: appColors.success, fontSize: 18 }}
                />
              ) : record.isActive ? (
                <Tag color={appColors.danger}>Đang diễn ra</Tag>
              ) : (
                    <Tag color={appColors.warning}>Sắp diễn ra</Tag>
                  )}
            </span>
            <span>
              <span className="mr-1">
                <Link to={'/qrgen?code=' + record.code} type="button" className="ant-btn ant-btn-sm ant-btn-danger">
                  <Icon type="qrcode" />
                  <span>Share</span>
                </Link>
              </span>
              <span>
                <Link to={'/d/' + record.code} type="button" className="ant-btn ant-btn-sm ant-btn-primary">
                  <Icon type="login" />
                  <span>Open</span>
                </Link>
              </span>
            </span>
          </div>
        </div>
      </Col>
    );
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
