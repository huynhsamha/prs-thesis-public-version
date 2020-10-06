import React from 'react';

import { Table } from '../../antd';

import { withNamespaces } from 'react-i18next';

class TableEditors extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    const { t } = this.props;

    this.columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: 'Display Name',
        dataIndex: 'displayName',
        key: 'displayName'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      }
    ];
  }

  parseDataToDS(data) {
    return (data || []).map(p => {
      return {
        _id: p._id,
        username: p.username,
        displayName: p.displayName,
        email: p.email
      };
    });
  }

  render() {
    const { data, t } = this.props;
    return (
      <>
        <div style={{ marginTop: 10 }}>
          <Table
            columns={this.columns}
            dataSource={this.parseDataToDS(data)}
            size="small"
            rowKey="_id"
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(TableEditors);
