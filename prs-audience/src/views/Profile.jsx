import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import MyProfile from '../components/MyProfile';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
                <h5 className="pb-3">Thông tin tài khoản</h5>
                <MyProfile />
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
