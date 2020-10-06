import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import EnterCode from '../components/EnterCode';
import Loading from '../components/HorizontalLoading';
import * as apiService from '../api';
import ListOpenSessions from '../components/sessions/ListOpenSessions';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newSessions: null,
      activeSessions: null
    };

    this.getUpcoming();
    this.getActive();
  }

  getUpcoming() {
    apiService
      .getUpcommingPublicSession()
      .then(data => {
        // console.log(data);
        this.setState({
          newSessions: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getActive() {
    apiService
      .getActivePublicSession()
      .then(data => {
        // console.log(data);
        this.setState({
          activeSessions: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card
              className="card-stats"
              style={{ padding: 5, paddingBottom: 20 }}
            >
              <CardBody>
                <h5 className="pb-1">Join by 6-digits code</h5>
                <div className="row">
                  <div className="col-12 col-lg-6">
                    <p className="mb-4">
                      Tham gia vào poll bằng mã 6 chữ số được người trình bày hiện
                      trên màn chiếu
                    </p>
                    <EnterCode />
                    <div className="mb-5"></div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <p className="mb-4">
                      Quản lý tài khoản Ethereum Blockchain của bạn tại mục{' '}
                      <b>My Profile</b>. Nếu bạn chưa có tài khoản Blockchain, vào mục{' '}
                      <b>My Profile</b> để tạo và sử dụng tính năng này của hệ thống.
                    </p>
                    <div className="text-center">
                      <Link to="/me" className="ant-btn ant-btn-primary ant-btn-block">Quản lý tài khoản Blockchain</Link>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card className="card-stats" style={{ minHeight: 320, padding: 5 }}>
              <CardBody>
                <h5 className="pb-3">Danh sách sessions đang được mở public</h5>
                <h6 className="pb-3">Active sessions</h6>
                {this.state.activeSessions == null ? (
                  <Loading visible={true} />
                ) : (
                    <ListOpenSessions sessions={this.state.activeSessions} />
                  )}
                <hr />
                <h6 className="pb-3">Upcoming sessions</h6>
                {this.state.newSessions == null ? (
                  <Loading visible={true} />
                ) : (
                    <ListOpenSessions sessions={this.state.newSessions} />
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

export default Dashboard;
