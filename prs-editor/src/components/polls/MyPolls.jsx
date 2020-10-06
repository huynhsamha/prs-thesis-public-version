import React from 'react';

import * as apiService from '../../api';

import { Tabs, Icon } from '../../antd';
import ListPolls from './ListPolls';

import { withNamespaces } from 'react-i18next';

const { TabPane } = Tabs;

class MyPolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quizes: [],
      surveys: []
    };
  }

  componentWillMount() {
    apiService.getMyPollTypeQuiz().then(res => {
      // console.log(res);
      this.setState({
        quizes: res.data || []
      });
    });

    apiService.getMyPollTypeSurvey().then(res => {
      // console.log(res);
      this.setState({
        surveys: res.data || []
      });
    });
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <h4>{t('title.list.poll.created')}</h4>
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

export default withNamespaces()(MyPolls);
