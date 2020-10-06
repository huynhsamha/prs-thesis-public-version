import React from 'react';
import { Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={'footer' + (this.props.default ? ' footer-default' : '')}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <Row>
            <nav className="footer-nav">
              <ul>
                <li>
                  <a href="/" target="_blank">
                    Personal Response System
                  </a>
                </li>
                <li>
                  <a href="/" target="_blank">
                    Licenses
                  </a>
                </li>
              </ul>
            </nav>
            <div className="credits ml-auto">
              {/* <div className="copyright">
                All rights reserved &copy; {1900 + new Date().getYear()} made
                with <i className="fa fa-heart heart text-danger"></i> by PRS
                Labs
              </div> */}
            </div>
          </Row>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool
};

export default Footer;
