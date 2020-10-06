import React from 'react';
import { Redirect } from 'react-router-dom';

import 'react-notification-alert/dist/animate.css';
import '../assets/scss/users/feedback.scss';

import { Button } from '../antd';

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Personal Response System | Code Not Found';

    this.state = {
      pageNotFound: false,
      routeToHome: false
    };
  }

  backtoHome = () => {
    this.setState({ routeToHome: true });
  };

  render() {
    const { message } = this.props;
    if (this.state.routeToHome) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <div className="feedback-form container-fluid">
          <div className="row">
            <div className="col-1 col-xs-1 col-sm-1 col-md-2 col-lg-3 col-xl-3"></div>
            <div className="col-10 col-xs-10 col-sm-10 col-md-8 col-lg-6 col-xl-6">
              <div className="main-content text-center">
                <h4>{message}</h4>
                <br />
                <Button
                  type="primary"
                  className="btn-block"
                  onClick={() => this.backtoHome()}
                >
                  Trở về trang chủ
                </Button>
                <br />
              </div>
            </div>
            <div className="col-1 col-xs-1 col-sm-1 col-md-2 col-lg-3 col-xl-3"></div>
          </div>
        </div>
      </>
    );
  }
}

export default PageNotFound;
