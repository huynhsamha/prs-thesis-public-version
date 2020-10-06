import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import { Table, Icon, Tooltip, Divider } from '../../antd';

import { withNamespaces } from 'react-i18next';
import { appColors } from '../../utils/constant';

class ListSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    const { t } = this.props;

    this.columns = [
      {
        title: t('name'),
        dataIndex: 'title',
        key: 'title',
        width: '30%'
      },
      {
        title: 'Loại',
        align: 'center',
        render: (text, record) => (
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
        )
      },
      {
        title: t('status'),
        align: 'center',
        render: (text, record) => (
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
        )
      },
      {
        title: 'Thời điểm bắt đầu',
        dataIndex: 'activeTime',
        key: 'activeTime'
      },
      {
        title: 'Thời điểm kết thúc',
        dataIndex: 'finishTime',
        key: 'finishTime'
      },
      {
        title: t('action'),
        align: 'center',
        render: (text, record) => (
          <span>
            <Tooltip placement="top" title={'Tham gia phản hồi'}>
              <a onClick={() => {}}>
                <Icon
                  type="eye"
                  style={{ color: appColors.info, fontSize: 18 }}
                  onClick={() => this.onClickDetail(record)}
                />
              </a>
            </Tooltip>
          </span>
        )
      }
    ];
  }

  onClickDetail = record => {
    window.open('/d/' + record.code);
  };

  parseSessionToDS(sessions) {
    return (sessions || []).map(p => {
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
        code: p.code
      };
    });
  }

  render() {
    const { sessions, t } = this.props;
    return (
      <>
        {sessions && (
          <div style={{ marginTop: 10 }}>
            <Table
              columns={this.columns}
              dataSource={this.parseSessionToDS(sessions)}
              size="small"
              rowKey="_id"
              // scroll={{ x: '120%' }}
            />
          </div>
        )}
      </>
    );
  }
}

export default withNamespaces()(ListSessions);
