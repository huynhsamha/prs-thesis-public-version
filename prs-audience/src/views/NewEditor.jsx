import React from 'react';
import { Card, CardBody, Row, CardFooter, Col } from 'reactstrap';
import { withNamespaces } from 'react-i18next';
import FormEditor from '../components/editors/FormEditor';

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
                <h5 className="pb-3">Thông tin Editor</h5>
                <FormEditor />
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