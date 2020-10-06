import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { Button } from '../antd';
import { Redirect } from 'react-router-dom';

import { withNamespaces } from 'react-i18next';

import PollEditor from '../components/polls/PollEditor';

import * as apiService from '../api';

class PollEditPage extends React.Component {
  constructor(props) {
    super(props);

    const { id } = this.props.match.params;

    this.state = {
      pollId: id,
      json: {},

      backToPollsList: false
    };

    this.getPoll();
  }

  getPoll() {
    apiService
      .getOnePoll(this.state.pollId)
      .then(data => data.data)
      .then(data => {
        console.log(data);
        if (data.questions === null) throw new Error('...');
        data.questions = data.questions.map(u => {
          return { ...u, id: u._id };
        });
        this.setState({ json: data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  backToPollsList = () => {
    this.setState({ backToPollsList: true });
  };

  render() {
    const { t } = this.props;

    if (this.state.backToPollsList) {
      return <Redirect to="/polls" />;
    }
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card
              className="card-stats"
              style={{ minHeight: 560, padding: 12 }}
            >
              <CardBody>
                <Button
                  icon="caret-left"
                  type="primary"
                  className="mb-3"
                  onClick={this.backToPollsList}
                >
                  {t('back')}
                </Button>
                <PollEditor type="update" json={this.state.json} />
                <hr />
                <Button
                  icon="caret-left"
                  type="primary"
                  className="mb-3 mt-4"
                  onClick={this.backToPollsList}
                >
                  {t('back')}
                </Button>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withNamespaces()(PollEditPage);
