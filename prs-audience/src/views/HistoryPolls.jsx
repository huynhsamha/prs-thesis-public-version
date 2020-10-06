import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import * as apiService from '../api';
import Loading from '../components/HorizontalLoading';
import ListSessions from '../components/sessions/ListSessions';

class HistoryPolls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: null
    };

    this.getData();
  }

  getData = () => {
    apiService
      .getHistorySessions()
      .then(data => {
        // console.log(data);
        this.setState({
          sessions: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card
              className="card-stats"
              style={{ minHeight: 320, padding: 12 }}
            >
              <CardBody>
                <h5 className="pb-3">Danh sách phản hồi của tôi</h5>
                {this.state.sessions ? (
                  <ListSessions sessions={this.state.sessions} />
                ) : (
                  <Loading visible={true} />
                )}
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HistoryPolls;
