import React from 'react';

import { Tabs, Icon } from '../../antd';
import ListPolls from './ListPolls';

import { withNamespaces } from 'react-i18next';

const { TabPane } = Tabs;

class SharedPolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizes: [],
      surveys: []
    };
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <h4>{t('title.list.poll.shared')}</h4>
        <Tabs tabPosition="top" animated={false} defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="schedule" />
                {t('quiz')}
              </span>
            }
            key="1"
          >
            <ListPolls polls={this.state.quizes} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="project" />
                {t('survey')}
              </span>
            }
            key="2"
          >
            <ListPolls polls={this.state.surveys} />
          </TabPane>
        </Tabs>
      </>
    );
  }
}

export default withNamespaces()(SharedPolls);
