import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PerfectScrollbar from 'perfect-scrollbar';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

import PollStorage from '../views/PollStorage';
import PollEditPage from '../views/PollEditPage';
import Icons from '../views/Icons';
import Session from '../views/Session';
import NewSession from '../views/NewSession';
import SessionEditPage from '../views/SessionEditPage';
import SessionDetailPage from '../views/SessionDetailPage';

import 'antd/dist/antd.min.css';

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'Personal Response System';
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.refs.mainPanel);
      document.body.classList.toggle('perfect-scrollbar-on');
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
      document.body.classList.toggle('perfect-scrollbar-on');
    }
  }

  componentDidUpdate(e) {
    if (e.history.action === 'PUSH') {
      this.refs.mainPanel.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Sidebar {...this.props} />
        <div className="main-panel" ref="mainPanel">
          <Header {...this.props} />
          <Switch>
            <Route path="/polls/:id" component={PollEditPage} exact={true} />
            <Route path="/polls" component={PollStorage} exact={true} />
            <Route path="/sessions/new" component={NewSession} exact={true} />
            <Route
              path="/sessions/:id"
              component={SessionEditPage}
              exact={true}
            />
            <Route
              path="/sessions/:id/detail"
              component={SessionDetailPage}
              exact={true}
            />
            <Route path="/sessions" component={Session} exact={true} />
            <Route path="/icons" component={Icons} exact={false} />
            <Redirect from="/" to="/polls" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard;
