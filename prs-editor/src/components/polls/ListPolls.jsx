import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import { Table, Divider, Tag, Icon, Tooltip, Input } from '../../antd';

import { withNamespaces } from 'react-i18next';
import PollJsonModal from './PollJsonModal';
import { labelColors, appColors } from '../../utils/constant';
import { removeFields, simpleClone } from '../../utils/object';
import { filter } from '../../utils/filterTable';
const { Search } = Input;

class ListPolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonModal: {},
      showModal: false,

      routeToEditPage: false,
      routeToNewSessionPage: false,
      pollClickedId: null,

      searchText: '',
      filteredInfo: null
    };

    const { t } = this.props;

    this.columns = [
      { title: 'Tiên đề', dataIndex: 'title', key: 'title' },
      {
        title: 'Phân loại',
        dataIndex: 'type',
        key: 'type',
        filters: [
          { text: 'Mẫu câu hỏi nhanh', value: 'quick' },
          { text: 'Bộ câu hỏi', value: 'full' },
        ],
        render: type => (
          <Tag color={labelColors[type]} key={type}>
            {t(type)}
          </Tag>
        )
      },
      {
        title: t('createdAt'), dataIndex: 'createdAt', key: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.createdAtTs - b.createdAtTs,
      },
      {
        title: t('updatedAt'), dataIndex: 'updatedAt', key: 'updatedAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.updateTS - b.updateTS,
      },
      {
        title: t('action'),
        render: (text, record) => (
          <span>
            <Tooltip placement="top" title={t('go-edit')}>
              <a onClick={() => { }}>
                <Icon
                  type="edit"
                  style={{ color: appColors.blue, fontSize: 18 }}
                  onClick={() => this.onClickEdit(record)}
                />
              </a>
            </Tooltip>
            {/* <Divider type="vertical" />
            <Tooltip placement="top" title={t('modal-download-json')}>
              <a onClick={() => this.onClickDownload(record)}>
                <Icon
                  type="cloud-download"
                  style={{ color: appColors.warning, fontSize: 18 }}
                />
              </a>
            </Tooltip> */}
            <Divider type="vertical" />
            <Tooltip placement="top" title={t('new-session')}>
              <a onClick={() => this.onClickNewSession(record)}>
                <Icon
                  type="plus-circle"
                  style={{ color: appColors.success, fontSize: 18 }}
                />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip placement="top" title={t('share-poll')}>
              <a onClick={() => this.onClickDownload(record)}>
                <Icon
                  type="share-alt"
                  style={{ color: appColors.warning, fontSize: 18 }}
                />
              </a>
            </Tooltip>
          </span>
        )
      }
    ];
  }

  onClickNewSession = record => {
    this.routeToNewSessionPage(record._id);
  };

  onClickEdit = record => {
    this.routeToEditPage(record._id);
  };

  routeToEditPage = pollId => {
    this.setState({
      pollClickedId: pollId,
      routeToEditPage: true
    });
  };

  routeToNewSessionPage = pollId => {
    this.setState({
      pollClickedId: pollId,
      routeToNewSessionPage: true
    });
  };

  onClickDownload = record => {
    // console.log(record);
    this.setState({
      showModal: true,
      jsonModal: record.json
    });
  };

  parsePollToDS(polls) {
    // console.log(polls);
    const { searchText } = this.state;
    const { t } = this.props;
    return polls
      .map(p => {
        const json = simpleClone(p);
        removeFields(json, ['_id', '__v', 'createdAt', 'updatedAt', 'owner']);
        return {
          _id: p._id,
          title: p.title,
          type: p.quickOrFull,
          createdAt: moment(p.createdAt).format('HH:mm DD/MM/YYYY'),
          updatedAt: moment(p.updatedAt).format('HH:mm DD/MM/YYYY'),
          json,
          updateTS: new Date(p.updatedAt).getTime(),
          payload: t(p.quickOrFull)
        };
      })
      .sort((u, v) => {
        return v.updateTS - u.updateTS;
      }).filter(p => {
        const { title, payload } = p;
        return filter(searchText, [title, payload]);
      }).filter(record => {
        const filteredInfo = this.state.filteredInfo || {}
        const types = filteredInfo.type || [];
        if (types.length > 0) {
          const success = types.map(value => {
            const success = (record.type == value)
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
    const { polls, t } = this.props;
    if (this.state.routeToEditPage && this.state.pollClickedId !== null) {
      return <Redirect to={'/polls/' + this.state.pollClickedId} />;
    }
    if (this.state.routeToNewSessionPage && this.state.pollClickedId !== null) {
      return (
        <Redirect to={'/sessions/new?pollID=' + this.state.pollClickedId} />
      );
    }
    return (
      <>
        <h6>{t('title.list.poll.common')}</h6>
        {polls && (
          <div style={{ marginTop: 10 }}>
            <div className="mt-4"></div>
            <Search placeholder="Input search text"
              onChange={e => this.setState({ searchText: e.target.value })}
              enterButton
              style={{ width: 300 }}
            />
            <div className="mt-4"></div>
            <Table
              columns={this.columns}
              dataSource={this.parsePollToDS(polls)}
              size="small"
              rowKey="_id"
              bordered
              pagination={{
                position: 'bottom', showSizeChanger: true,
                showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
                size: 'large',
              }}
              onChange={this.handleChange}
            />
          </div>
        )}
        {polls && (
          <PollJsonModal
            visible={this.state.showModal}
            title={'Thông tin mẫu câu hỏi'}
            json={this.state.jsonModal}
            disableUpdate={true}
            onClose={() => this.setState({ showModal: false })}
          />
        )}
      </>
    );
  }
}

export default withNamespaces()(ListPolls);
