import React from 'react';

import { Button, Modal, notification } from '../../antd';

import JSONInput from 'react-json-editor-ajrm';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const openNotificationWithIcon = type => {
  notification[type]({
    message: 'Copied',
    description: 'JSON Schema has been copied to clipboard',
    duration: 3
  });
};

class PollJsonModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      json: {},
      title: '',
      loading: false,
      disableUpdate: false
    };

    // props: visible, title, json, onComplete(json), onClose(), loading, disableUpdate
  }

  componentWillReceiveProps(nextProps) {
    const { visible, json, title, loading, disableUpdate } = nextProps;

    this.setState({
      json: json || {},
      title: title || '',
      loading: loading || false,
      disableUpdate: disableUpdate || false
    });
  }

  handleCancel = () => {
    this.setState({
      json: {},
      title: '',
      loading: false,
      disableUpdate: false
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleOk = () => {
    if (this.props.onComplete) {
      this.props.onComplete(this.state.json);
    }
  };

  render() {
    return (
      <>
        <Modal
          title={this.state.title}
          centered
          visible={this.props.visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          width={700}
          footer={[
            <CopyToClipboard
              key="copy"
              text={JSON.stringify(this.state.json, null, 4)}
              onCopy={() => {
                openNotificationWithIcon('success');
              }}
            >
              <Button type="primary" icon="copy" onClick={this.handleCopyJSON}>
                Copy JSON
              </Button>
            </CopyToClipboard>,
            <Button
              key="cancel"
              type="default"
              icon="close"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>,
            <Button
              key="save"
              type="danger"
              icon="save"
              onClick={this.handleOk}
              loading={this.props.loading}
              disabled={this.props.disableUpdate}
            >
              Update
            </Button>
          ]}
        >
          <JSONInput
            id="modal_json_schema"
            placeholder={this.state.json}
            height="360px"
            width="100%"
            onChange={o => {
              this.setState({ json: o.jsObject });
            }}
          />
        </Modal>
      </>
    );
  }
}

export default PollJsonModal;
