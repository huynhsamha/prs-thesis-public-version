import React from 'react';

import { Button, Modal } from '../../antd';

class FeedbackModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      data: null
    };

    // props: visible, title, onComplete(json), onClose()
  }

  componentWillReceiveProps(nextProps) {
    const { visible, title, data } = nextProps;

    this.setState({
      title: title || '',
      data
    });
  }

  handleCancel = () => {
    this.setState({
      title: ''
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleOk = () => {
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  };

  renderRow(q, i) {
    return (
      <tr key={q._id} className="ant-table-row">
        <td className="text-center">{i + 1}</td>
        <td className="overflow-break-word">
          <div className="overflow-break-word">{q.title}</div>
        </td>
        <td className="text-center">
          <code>{q.type}</code>
        </td>
        <td className="overflow-break-word font-italic">
          <div className="overflow-break-word">
            {q.answer && (
              <>
                {q.type == 'text' && q.answer}
                {q.type == 'single' && q.answer.value}
                {q.type == 'multiple' && q.answer.map(u => u.value).join(', ')}
              </>
            )}
          </div>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <>
        <Modal
          title={this.state.title}
          visible={this.props.visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          width={'90%'}
          footer={[]}
        >
          <div style={{ width: '100%' }}>
            <table
              // className="table table-hover table-sm table-bordered"
              className="ant-table ant-table-bordered ant-table-small"
            // style={{ tableLayout: 'fixed', width: '100%' }}
            >
              <thead className="ant-table-thead">
                <tr className="ant-table-row">
                  <th style={{ width: '8%' }}>Thứ tự</th>
                  <th style={{ width: '50%' }}>Câu hỏi</th>
                  <th style={{ width: '12%' }}>Loại</th>
                  <th style={{ width: '30%' }}>Trả lời</th>
                </tr>
              </thead>
              <tbody className="ant-table-tbody">
                {(this.state.data || []).map((q, i) => {
                  return this.renderRow(q, i);
                })}
              </tbody>
            </table>
          </div>
        </Modal>
      </>
    );
  }
}

export default FeedbackModal;
