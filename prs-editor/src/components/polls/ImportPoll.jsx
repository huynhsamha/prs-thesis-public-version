import React from 'react';

import { alertSuccess, confirmWarning } from '../../utils/customAlert';

import { Tabs, Button } from '../../antd';

import { withNamespaces } from 'react-i18next';

import JSONInput from 'react-json-editor-ajrm';

import PollPreview from './PollPreview';

import * as apiService from '../../api';

const sample = require('../../json/survey_1.json');

const { TabPane } = Tabs;

class ImportPoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      json: sample,
      panes: [
        {
          title: 'New Tab',
          key: '3'
        }
      ],
      tabActiveKey: '1'
    };
    this.newTabIndex = 4;

    this.defaultJSON = sample;
  }

  addPane = () => {
    const { panes } = this.state;
    const tabActiveKey = `${this.newTabIndex++}`;
    panes.push({
      title: 'New Tab',
      key: tabActiveKey
    });
    this.setState({ panes, tabActiveKey });
  };

  removePane = targetKey => {
    let { tabActiveKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && tabActiveKey === targetKey) {
      if (lastIndex >= 0) {
        tabActiveKey = panes[lastIndex].key;
      } else {
        tabActiveKey = panes[0].key;
      }
    } else {
      tabActiveKey = '1';
    }
    this.setState({ panes, tabActiveKey });
  };

  onClickComplete = () => {
    confirmWarning('Bạn xác nhận sẽ import poll này?').then(ok => {
      if (!ok) return;
      const schema = this.state.json;
      console.log(schema);
      apiService
        .createPoll(schema)
        .then(data => {
          console.log(data);
          alertSuccess('Poll đã được import thành công').then(() => {
            window.location.reload();
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  render() {
    const { t } = this.props;
    return (
      <>
        <h4>{t('title.import-json')}</h4>
        <br />
        <Tabs
          activeKey={this.state.tabActiveKey}
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === 'add') {
              this.addPane();
            } else if (action === 'remove') {
              this.removePane(targetKey);
            }
          }}
          onChange={activeKey => {
            this.setState({ tabActiveKey: activeKey });
          }}
        >
          <TabPane tab="JSON Editor" key="1" closable={false}>
            <JSONInput
              id="json_schema"
              placeholder={this.defaultJSON}
              height="400px"
              width="100%"
              onChange={o => {
                // console.log(o);
                this.setState({ json: o.jsObject });
              }}
            />
          </TabPane>
          <TabPane tab="Preview" key="2" closable={false}>
            <PollPreview json={this.state.json} />
          </TabPane>
          {this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key}>
              <JSONInput
                id={'json_schema_' + pane.key}
                height="400px"
                width="100%"
                placeholder={{
                  title: ''
                }}
              />
            </TabPane>
          ))}
        </Tabs>
        <br />
        <Button
          type="danger"
          icon="cloud-upload"
          onClick={this.onClickComplete}
        >
          Import
        </Button>
      </>
    );
  }
}

export default withNamespaces()(ImportPoll);
