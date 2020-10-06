import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { Tabs, Icon } from '../antd';

import { withNamespaces } from 'react-i18next';

import RecentSessions from '../components/sessions/RecentSessions';
import RunningSessions from '../components/sessions/RunningSessions';
import FinishedSessions from '../components/sessions/FinishedSessions';
import FutureSessions from '../components/sessions/FutureSessions';

const { TabPane } = Tabs;

class Session extends React.Component {
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
                        <Icon type="clock-circle" />
                        {t('recently')}
                      </span>
                    }
                    key="1"
                  >
                    <RecentSessions />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="sync" />
                        {t('running')}
                      </span>
                    }
                    key="2"
                  >
                    <RunningSessions />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="calendar" />
                        {t('inactive')}
                      </span>
                    }
                    key="3"
                  >
                    <FutureSessions />
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <Icon type="check-circle" />
                        {t('finished')}
                      </span>
                    }
                    key="4"
                  >
                    <FinishedSessions />
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

export default withNamespaces()(Session);
