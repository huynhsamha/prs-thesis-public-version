import React from 'react';
import moment from 'moment';

import { Table, Button, Divider, Input } from '../../antd';
import { appColors } from '../../utils/constant';
import { enableAudience, disableAudience, deleteAudience } from '../../api';
import {
  alertError,
  alertSuccess,
  confirmWarning
} from '../../utils/customAlert';
import { filter } from '../../utils/filterTable';
const { Search } = Input;

class TableAudiences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };

    const { ban } = props;

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
      },
      {
        title: 'Action',
        render: (text, record) => (
          <span>
            {ban ? (
              <>
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => this.enableUser({ userId: record._id })}
                >
                  Enable
                </Button>
                <Divider type="vertical" />
                <Button
                  type="danger"
                  icon="delete"
                  onClick={() => this.deleteUser({ userId: record._id })}
                >
                  Delete
                </Button>
              </>
            ) : (
                <>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: appColors.warning,
                      borderColor: appColors.warning
                    }}
                    icon="minus"
                    onClick={() => this.banUser({ userId: record._id })}
                  >
                    Disable
                </Button>
                  <Divider type="vertical" />
                  <Button
                    type="danger"
                    icon="delete"
                    onClick={() => this.deleteUser({ userId: record._id })}
                  >
                    Delete
                </Button>
                </>
              )}
          </span>
        )
      }
    ];
  }

  enableUser = ({ userId }) => {
    enableAudience({ userId })
      .then(() => {
        alertSuccess('Cập nhật thành công').then(ok => {
          window.location.reload();
        });
      })
      .catch(err => {
        alertError('Không thành công. Vui lòng thử lại sau');
      });
  };

  banUser = ({ userId }) => {
    disableAudience({ userId })
      .then(() => {
        alertSuccess('Cập nhật thành công').then(ok => {
          window.location.reload();
        });
      })
      .catch(err => {
        alertError('Không thành công. Vui lòng thử lại sau');
      });
  };

  deleteUser = ({ userId }) => {
    confirmWarning('Xoá tài khoản này?').then(ok => {
      if (ok) {
        deleteAudience({ userId })
          .then(() => {
            alertSuccess('Xoá thành công').then(ok => {
              window.location.reload();
            });
          })
          .catch(err => {
            alertError('Không thành công. Vui lòng thử lại sau');
          });
      }
    });
  };

  parseDataToDS(data) {
    const { searchText } = this.state;
    return (data || []).map(p => {
      return {
        _id: p._id,
        email: p.email,
        displayName: p.displayName,
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
    const { data } = this.props;
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

export default TableAudiences;
