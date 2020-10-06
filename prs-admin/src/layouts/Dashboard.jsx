import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PerfectScrollbar from 'perfect-scrollbar';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

// import Icons from '../views/Icons';
import Editors from '../views/Editors';
import NewEditor from '../views/NewEditor';
import NewAudience from '../views/NewAudience';

import 'antd/dist/antd.min.css';
import Audiences from '../views/Audiences';
import BanAudiences from '../views/BanAudiences';

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    document.title = 'PRS Administration';
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
            <Route path="/editors/new" component={NewEditor} exact={true} />
            <Route path="/audience/new" component={NewAudience} exact={true} />
            <Route path="/editors" component={Editors} exact={true} />
            <Route path="/audiences" component={Audiences} exact={true} />
            <Route
              path="/audiences/ban"
              component={BanAudiences}
              exact={true}
            />
            {/* <Route path="/icons" component={Icons} exact={false} /> */}
            <Redirect from="/" to="/editors" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

export default Dashboard;
