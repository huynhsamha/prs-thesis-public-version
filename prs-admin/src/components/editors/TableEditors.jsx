import React from 'react';
import moment from 'moment';

import { Table, Input } from '../../antd';

import { withNamespaces } from 'react-i18next';
import { filter } from '../../utils/filterTable';
const { Search } = Input;

class TableEditors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };

    this.columns = [
      {
        title: 'Name',
        dataIndex: 'displayName',
        key: 'displayName',
        render: (text, record) => (
          <span>
            <img src={record.avatar} width={32} />
            <span className="ml-3">{record.displayName}</span>
          </span>
        )
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Join At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.createdAtTs - b.createdAtTs,
      }
    ];
  }

  parseDataToDS(data) {
    const { searchText } = this.state;
    return (data || []).map(p => {
      return {
        _id: p._id,
        displayName: p.displayName,
        email: p.email,
        createdAt: moment(p.createdAt).format('DD/MM/YYYY [at] HH:mm:ss'),
        avatar: p.avatar,
        createdAtTs: new Date(p.createdAt).getTime(),
      };
    }).filter(p => {
      const { email, displayName } = p;
      return filter(searchText, [email, displayName]);
    })
  }

  render() {
    const { data, t } = this.props;
    return (
      <>
        <div style={{ marginTop: 10 }}>
          <Search placeholder="Input search text"
            onChange={e => this.setState({ searchText: e.target.value })}
            enterButton
            style={{ width: 300 }}
          />
          <div className="mt-4"></div>
          <Table
            columns={this.columns}
            dataSource={this.parseDataToDS(data)}
            size="small"
            rowKey="_id"
            bordered
            pagination={{
              position: 'bottom', showSizeChanger: true,
              showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
              size: 'large',
            }}
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(TableEditors);
