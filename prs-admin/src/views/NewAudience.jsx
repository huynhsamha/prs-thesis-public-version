import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import FormAudience from '../components/editors/FormAudience';

class NewEditor extends React.Component {
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
              style={{ minHeight: 320, padding: 12 }}
            >
              <CardBody>
                <h5 className="pb-3">Add whitelist Audience</h5>
                <i className="mb-3">
                  Nhập email của audience vào hệ thống, một tài khoản với email
                  sẽ được tạo. Điều này cho phép người dùng có thể đăng nhập
                  bằng email này.
                </i>
                <FormAudience />
              </CardBody>
              <CardFooter />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withNamespaces()(NewEditor);
