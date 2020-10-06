import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { Button } from '../antd';
import { Redirect } from 'react-router-dom';
import qs from 'qs';

import SessionDetailInfo from '../components/sessions/SessionDetailInfo';

import * as apiService from '../api';
import SessionDetailActive from '../components/sessions/SessionDetailActive';
import SessionDetailResult from '../components/sessions/SessionDetailResult';
import HorizontalLoading from '../components/HorizontalLoading';

class SessionDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    const { id } = this.props.match.params;
    let { search } = this.props.location;
    if (!search || search.length == 0) search = '?';
    const query = qs.parse(search.slice(1));

    this.sessionId = id;

    this.state = {
      sessionId: id,
      session: null,
      backToList: false,
      gotoEdit: false,

      loadResult: false,
      requireResult: query.action == 'result'
    };
  }

  componentWillMount() {
    this.getSession();
  }

  backToList = () => {
    this.setState({ backToList: true, gotoEdit: false });
  };

  gotoEdit = () => {
    this.setState({ gotoEdit: true, backToList: false });
  };

  parseSession = session => {
    const _activeTime = new Date(session.activeTime).getTime();
    const _finishTime = new Date(session.finishTime).getTime();
    const now = Date.now();
    session.isActive = _activeTime < now && now < _finishTime;
    session.isComplete = _finishTime <= now;
    session.isPublic = session.type == 'public';
    session.duration = _finishTime - _activeTime;
    return session;
  };

  getSession() {
    apiService
      .getOneSession(this.state.sessionId)
      .then(data => data.data)
      .then(data => {
        console.log(data);
        this.setState({
          session: this.parseSession(data)
        });
        if (this.state.requireResult) {
          this.setState({
            requireResult: false,
            loadResult: true
          });
        }
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
          icon="edit"
          className="mb-3 mt-4"
          type="danger"
          onClick={this.gotoEdit}
        >
          Vào trang tùy chỉnh
        </Button>
      </div>
    );
  }

  render() {
    if (this.state.backToList) {
      return <Redirect to="/sessions" />;
    }

    if (this.state.gotoEdit) {
      return <Redirect to={'/sessions/' + this.sessionId} />;
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
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <SessionDetailInfo
                      {...this.props}
                      session={this.state.session}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} className="mt-3">
                    <SessionDetailActive
                      {...this.props}
                      session={this.state.session}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} className="mt-3">
                    <hr />
                    {!this.state.loadResult && !this.state.requireResult && (
                      <Button
                        icon="pie-chart"
                        className=""
                        type="primary"
                        onClick={() => {
                          this.setState({ loadResult: true });
                        }}
                      >
                        Load Result
                      </Button>
                    )}
                    <HorizontalLoading visible={this.state.requireResult} />
                    {this.state.loadResult && (
                      <SessionDetailResult
                        sessionId={(this.state.session || {})._id}
                        pollID={(this.state.session || {}).pollID}
                      />
                    )}
                  </Col>
                </Row>

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

export default SessionDetailPage;
