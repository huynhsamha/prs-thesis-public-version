import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { Tabs, Icon } from '../antd';

import { withNamespaces } from 'react-i18next';

import MyPolls from '../components/polls/MyPolls';
import SharedPolls from '../components/polls/SharedPolls';
import PollEditor from '../components/polls/PollEditor';
import ImportPoll from '../components/polls/ImportPoll';

const { TabPane } = Tabs;

class PollStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;

    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card
              className="card-stats"
              style={{ minHeight: 560, padding: 12 }}
            >
              <CardBody>
                <Tabs defaultActiveKey="1" animated={false} tab>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="unordered-list" />
                        {t('my-polls')}
                      </span>
                    }
                    key="1"
                  >
                    <MyPolls />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="share-alt" />
                        {t('shared-polls')}
                      </span>
                    }
                    key="2"
                  >
                    <SharedPolls />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="plus-circle" />
                        {t('new')}
                      </span>
                    }
                    key="3"
                  >
                    <PollEditor type="create" />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="cloud-upload" />
                        {t('import')}
                      </span>
                    }
                    key="4"
                  >
                    <ImportPoll />
                  </TabPane>
                </Tabs>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withNamespaces()(PollStorage);
