import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PerfectScrollbar from 'perfect-scrollbar';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import DashboardPage from '../views/Dashboard';
import Profile from '../views/Profile';

import 'antd/dist/antd.min.css';
import HistoryPolls from '../views/HistoryPolls';

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'PRS Audience';
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
            <Route path="/dashboard" component={DashboardPage} exact={true} />
            <Route path="/history" component={HistoryPolls} exact={true} />
            <Route path="/dashboard" component={DashboardPage} exact={true} />
            <Route path="/me" component={Profile} exact={true} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard;
