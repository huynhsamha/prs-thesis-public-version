import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { Button } from '../antd';
import { withNamespaces } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import SessionEditor from '../components/sessions/SessionEditor';

import * as apiService from '../api';
import { appColors } from '../utils/constant';

class SessionEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    const { id } = this.props.match.params;
    this.sessionId = id;

    this.state = {
      sessionId: id,
      session: null,
      backToList: false,
      goToDetail: false
    };
  }

  componentWillMount() {
    this.getSession();
  }

  backToList = () => {
    this.setState({ backToList: true, goToDetail: false });
  };

  goToDetail = () => {
    this.setState({ goToDetail: true, backToList: false });
  };

  getSession() {
    apiService
      .getOneSession(this.state.sessionId)
      .then(data => data.data)
      .then(data => {
        console.log(data);
        this.setState({
          session: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderNav() {
    return (
      <div className="d-flex justify-content-between">
        <Button
          icon="caret-left"
          type="primary"
          className="mb-3 mt-4"
          onClick={this.backToList}
        >
          Quay trở về
        </Button>
        <Button
          icon="control"
          className="mb-3 mt-4"
          type="danger"
          onClick={this.goToDetail}
        >
          Xem chi tiết
        </Button>
      </div>
    );
  }

  render() {
    const { t } = this.props;

    if (this.state.backToList) {
      return <Redirect to="/sessions" />;
    }

    if (this.state.goToDetail) {
      return <Redirect to={'/sessions/' + this.sessionId + '/detail'} />;
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
                {this.renderNav()}

                <h5 className="pb-3">{t('title.edit-session')}</h5>

                <SessionEditor
                  {...this.props}
                  type="update"
                  session={this.state.session}
                />
                <hr />
              </CardBody>
              <CardFooter>{this.renderNav()}</CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withNamespaces()(SessionEditPage);
