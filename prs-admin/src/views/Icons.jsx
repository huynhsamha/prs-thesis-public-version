import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

import icons from '../assets/icons';

class Icons extends React.Component {
  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <Card className="demo-icons">
              <CardBody className="all-icons">
                <div id="icons-wrapper">
                  <section>
                    <ul>
                      {icons.map((prop, key) => {
                        return (
                          <li key={key}>
                            <i className={'nc-icon ' + prop.name} />
                            <p>{prop.name}</p>
                            <em>{prop.content}</em>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Icons;
