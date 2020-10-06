import React from 'react';
import moment from 'moment';

import { Table, Icon, Input } from '../../antd';

import { withNamespaces } from 'react-i18next';
import { appColors } from '../../utils/constant';
import { alertError } from '../../utils/customAlert';
import FeedbackModal from './FeedbackModal';
import { filter } from '../../utils/filterTable';
const { Search } = Input;

class ListFeedbacks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: null,
      showModalFeedback: false,
      dataInModal: null,
      searchText: '',
    };

    this.columns = [
      {
        title: 'Người phản hồi',
        render: (text, record) => (
          <span>
            <img src={record.owner.avatar} width={32} />
            <span className="ml-3">{record.owner.displayName}</span>
          </span>
        )
      },
      {
        title: 'Thời gian phản hồi',
        dataIndex: '_createdAt',
        key: '_createdAt',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.createdAtTS - b.createdAtTS,
      },
      {
        title: 'Xem câu trả lời',
        align: 'center',
        render: (text, record) => (
          <a onClick={() => { }}>
            <Icon
              type="eye"
              style={{ color: appColors.info, fontSize: 18 }}
              onClick={() => this.onClickViewAnswer(record)}
            />
          </a>
        )
      }
    ];
  }

  onClickViewAnswer(feedback) {
    console.log(feedback);
    const { questions } = this.state;
    if (!questions) {
      alertError('Danh sách câu hỏi đang được xử lý');
      return;
    }
    const { answers } = feedback;
    const qs = [...questions].map(q => {
      const { _id, title, type, choices } = q;
      let _choices = {};
      for (let c of choices) {
        _choices[c.id] = { id: c.id, value: c.value };
      }
      let answer = null;
      const _answer = answers[_id];
      if (_answer) {
        if (type == 'single') {
          answer = _choices[_answer];
        } else if (type == 'multiple') {
          answer = [..._answer].map(p => _choices[p]);
        } else {
          // text
          answer = _answer;
        }
      }
      return {
        _id,
        title,
        type,
        answer
      };
    });
    this.setState({ showModalFeedback: true, dataInModal: qs });
  }

  componentWillReceiveProps(nextProps) {
    const { questions } = nextProps;
    this.setState({ questions });
  }

  parseDataToDS(feedbacks) {
    const { searchText } = this.state;
    return [...(feedbacks || [])]
      .map(p => {
        p.owner = p.owner || {};
        return {
          ...p,
          _id: p._id,
          _createdAt: moment(p.createdAt).format('DD/MM/YYYY [at] HH:mm:ss'),
          ts: p.createdAt,
          createdAtTS: new Date(p.createdAt).getTime()
        };
      })
      .sort((u, v) => {
        return v.createdAtTS - u.createdAtTS;
      }).filter(p => {
        const owner = p.owner || {};
        return filter(searchText, [owner.email || '', owner.displayName || '']);
      })
  }

  render() {
    const { data } = this.props;

    return (
      <>
        <div style={{ marginTop: 20 }}>
          <h4>Danh sách các feedbacks</h4>
          <div className="mt-3"></div>
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
          <FeedbackModal
            title={'Kết quả feedback'}
            visible={this.state.showModalFeedback}
            data={this.state.dataInModal}
            onClose={() =>
              this.setState({ showModalFeedback: false, dataInModal: null })
            }
            onComplete={() =>
              this.setState({ showModalFeedback: false, dataInModal: null })
            }
          />
        </div>
      </>
    );
  }
}

export default withNamespaces()(ListFeedbacks);
