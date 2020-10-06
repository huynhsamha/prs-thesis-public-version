import React from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import { Table, Divider, Tag, Icon, Tooltip } from '../antd';

import { labelColors, appColors } from '../utils/constant';

class ListPolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonModal: {},
      showModal: false,

      routeToEditPage: false,
      routeToNewSessionPage: false,
      pollClickedId: null
    };

    this.columns = [
      { title: 'Title', dataIndex: 'title', key: 'title' },
      {
        title: 'Phân loại',
        dataIndex: 'type',
        key: 'type',
        render: type => (
          <Tag color={labelColors[type]} key={type}>
            {type}
          </Tag>
        )
      },
      {
        title: 'Thao tác',
        render: (text, record) => <span></span>
      }
    ];
  }

  parsePollToDS(polls) {
    return polls.map(p => {
      return {
        _id: p._id,
        title: p.title,
        type: p.quickOrFull
      };
    });
  }

  render() {
    const { polls, t } = this.props;
    return (
      <>
        {polls && (
          <div style={{ marginTop: 10 }}>
            <Table
              columns={this.columns}
              dataSource={this.parsePollToDS(polls)}
              size="small"
              rowKey="_id"
            />
          </div>
        )}
      </>
    );
  }
}

export default ListPolls;
