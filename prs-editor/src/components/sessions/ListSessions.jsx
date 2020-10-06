import React from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { Redirect } from 'react-router-dom';

import { Table, Icon, Tooltip, Divider, Input } from '../../antd';

import { withNamespaces } from 'react-i18next';
import { appColors } from '../../utils/constant';
import { CompareSession } from '../../utils/comparator';
import { filter } from '../../utils/filterTable';
const { Search } = Input;

momentDurationFormatSetup(moment);

class ListSessions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routeToEdit: false,
      recordToEditId: null,
      routeToDetail: false,
      detailRecordId: null,
      detailRecordAction: null,
      searchText: '',
      filteredInfo: null
    };

    const { t } = this.props;

    this.columns = [
      {
        title: t('name'),
        dataIndex: 'title',
        key: 'title',
        width: '30%'
        // ellipsis: true
      },
      {
        title: 'Loại',
        align: 'center',
        key: 'type',
        filters: [
          { text: 'Public Session', value: 'public' },
          { text: 'Private Session', value: 'private' },
          { text: 'Secure Private Session', value: 'secure' }
        ],
        // filteredValue: (this.state.filteredInfo || {}).type || null,
        // onFilter: (value, record) => {
        //   // console.log(value, record);
        //   return (record.isPublic && value == 'public')
        //     || (!record.isPublic && record.usePassword == true && value == 'secure')
        //     || (!record.isPublic && !record.usePassword && value == 'private')
        // },
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
        key: 'activeTime',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.activeTS - b.activeTS,
      },
      {
        title: 'Thời điểm kết thúc',
        dataIndex: 'finishTime',
        key: 'finishTime',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.finishTS - b.finishTS,
      },
      {
        title: 'Thời lượng',
        dataIndex: 'duration',
        key: 'duration',
        width: '10%',
        render: (text, record) => <code>{text}</code>
      },
      {
        title: t('action'),
        align: 'center',
        render: (text, record) => (
          <span>
            <Tooltip placement="top" title={t('go-edit')}>
              <a onClick={() => { }}>
                <Icon
                  type="edit"
                  style={{ color: appColors.info, fontSize: 18 }}
                  onClick={() => this.onClickEdit(record)}
                />
              </a>
            </Tooltip>
            <Divider type="vertical" className="ml-2 mr-2" />
            <Tooltip
              placement="top"
              title={
                record.isComplete
                  ? 'Xem kết quả session'
                  : 'Xem chi tiết session'
              }
            >
              {record.isComplete ? (
                <a onClick={() => { }}>
                  <Icon
                    type="pie-chart"
                    style={{ color: appColors.warning, fontSize: 18 }}
                    onClick={() => this.onClickViewResult(record)}
                  />
                </a>
              ) : (
                  <a onClick={() => { }}>
                    <Icon
                      type="control"
                      style={{ color: appColors.success, fontSize: 18 }}
                      onClick={() => this.onClickControl(record)}
                    />
                  </a>
                )}
            </Tooltip>
          </span>
        )
      }
    ];
  }

  onClickViewResult = record => {
    this.routeToDetailPage(record._id, 'result');
  };
  onClickControl = record => {
    this.routeToDetailPage(record._id, 'control');
  };

  onClickEdit = record => {
    this.routeToEditPage(record._id);
  };

  routeToEditPage = id => {
    this.setState({
      recordToEditId: id,
      routeToEdit: true
    });
  };

  routeToDetailPage = (id, action) => {
    this.setState({
      detailRecordId: id,
      routeToDetail: true,
      detailRecordAction: action
    });
  };

  routeToEditPage = pollId => {
    this.setState({
      recordToEditId: pollId,
      routeToEdit: true
    });
  };

  parseSessionToDS(sessions) {
    const { searchText } = this.state;
    return (sessions || [])
      .map(p => {
        const _activeTime = new Date(p.activeTime).getTime();
        const _finishTime = new Date(p.finishTime).getTime();
        const now = Date.now();

        let duration = moment
          .duration(_finishTime - _activeTime)
          .format('HH:mm:ss');

        return {
          _id: p._id,
          title: p.title || 'Đây là một cái tên khá là dài luôn đó',
          activeTime: moment(p.activeTime).format('DD/MM/YYYY HH:mm'),
          finishTime: moment(p.finishTime).format('DD/MM/YYYY HH:mm'),
          isActive: _activeTime < now && now < _finishTime,
          isComplete: _finishTime <= now,
          url: p.url,
          duration,
          isPublic: p.type == 'public',
          usePassword: p.usePassword,
          activeTS: _activeTime,
          finishTS: _finishTime
        };
      })
      .sort((u, v) => {
        return CompareSession(
          { startTime: u.activeTS, endTime: u.finishTS },
          { startTime: v.activeTS, endTime: v.finishTS }
        );
      }).filter(p => {
        const { title } = p;
        return filter(searchText, [title]);
      }).filter(record => {
        const filteredInfo = this.state.filteredInfo || {}
        const types = filteredInfo.type || [];
        if (types.length > 0) {
          const success = types.map(value => {
            const success = (record.isPublic && value == 'public')
              || (!record.isPublic && record.usePassword == true && value == 'secure')
              || (!record.isPublic && !record.usePassword && value == 'private')
            return success;
          }).reduce((a, b) => a || b, false);
          if (!success) return false;
        }
        return true;
      })
  }

  handleChange = (pagination, filters, sorter) => {
    // console.log(filters);
    if (filters != null) {
      this.setState({
        filteredInfo: filters,
      });
    }
  };

  render() {
    const { sessions, t } = this.props;
    if (this.state.routeToEdit && this.state.recordToEditId !== null) {
      return <Redirect to={'/sessions/' + this.state.recordToEditId} />;
    }
    if (
      this.state.routeToDetail &&
      this.state.detailRecordId !== null &&
      this.state.detailRecordAction != null
    ) {
      return (
        <Redirect
          to={
            '/sessions/' +
            this.state.detailRecordId +
            '/detail?action=' +
            this.state.detailRecordAction
          }
        />
      );
    }
    return (
      <>
        {sessions && (
          <div style={{ marginTop: 10 }}>
            <div className="mt-1"></div>
            <Search placeholder="Input search text"
              onChange={e => this.setState({ searchText: e.target.value })}
              enterButton
              style={{ width: 300 }}
            />
            <div className="mt-4"></div>
            <Table
              columns={this.columns}
              dataSource={this.parseSessionToDS(sessions)}
              size="small"
              rowKey="_id"
              // scroll={{ x: '120%' }}
              pagination={{
                position: 'bottom', showSizeChanger: true,
                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                size: 'large',
              }}
              onChange={this.handleChange}
            />
          </div>
        )}
      </>
    );
  }
}

export default withNamespaces()(ListSessions);
