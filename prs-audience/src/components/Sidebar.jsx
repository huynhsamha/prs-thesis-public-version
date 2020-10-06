import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import PerfectScrollbar from 'perfect-scrollbar';
import { withNamespaces } from 'react-i18next';
import LoadingOverlay from 'react-loading-overlay';

import brand from '../assets/icons/favicon.png';
import { confirmWarning, alertError } from '../utils/customAlert';
import { logout } from '../api';
import * as drive from '../api/drive';

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);

    this.state = {
      showMessageLoading: false,
      messageLoading: '',
      initAndLoadGAPI: null,
    }
  }

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName, isExact = false, excludes = []) {
    if (!isExact) {
      if (this.props.location.pathname.indexOf(routeName) == -1) return '';
      for (let p of excludes) {
        if (this.props.location.pathname.indexOf(p) > -1) return '';
      }
      return 'active';
    }
    return this.props.location.pathname === routeName ? 'active' : '';
  }

  componentDidMount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf('Win') > -1) {
      ps.destroy();
    }
  }

  onClickLogout = () => {
    const { t } = this.props;
    confirmWarning(t('message.confirm.logout')).then(ok => {
      if (ok) {
        this.setState({
          showMessageLoading: true,
          messageLoading: 'Logging out...'
        })
        logout()
          .then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 5000);
            console.log('drive.load');
            drive.load(() => {
              drive.initClient().then(() => {
                console.log('Success - loadAndInitGoogleDrive');
                if (drive.isSignIn()) {
                  console.log('drive.doSignOut');
                  drive.doSignOut();
                }
                window.location.reload();
              })
                .catch(err => {
                  console.log(err);
                  window.location.reload();
                });
            });
          })
          .catch(err => {
            this.setState({
              showMessageLoading: false,
            })
            alertError(t('message.common.error'));
          });
      }
    });
  }

  renderMessageLoading() {
    return (
      <LoadingOverlay
        active={this.state.showMessageLoading}
        spinner
        text={this.state.messageLoading}
      ></LoadingOverlay>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <>
        <div className="sidebar" data-color="black" data-active-color="info">
          <div className="logo" style={{ backgroundColor: 'white' }}>
            <a href="/" className="simple-text logo-normal">
              <div>
                <img src={brand} alt="CSE" width="30" className="mr-1" />
                <img
                  src={require('../assets/img/brand_name.png')}
                  alt="HCMUT"
                  width="195"
                />
              </div>
            </a>
          </div>
          <div className="sidebar-wrapper" ref="sidebar">
            <Nav>
              <li className={this.activeRoute('/dashboard', true)}>
                <NavLink
                  to={'/dashboard'}
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="fa fa-tachometer-alt" />
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className={this.activeRoute('/history', true)}>
                <NavLink
                  to={'/history'}
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="fa fa-history" />
                  <p>History</p>
                </NavLink>
              </li>
              <li className={this.activeRoute('/me', true)}>
                <NavLink to={'/me'} className="nav-link" activeClassName="active">
                  <i className="fa fa-user" />
                  <p>My Profile</p>
                </NavLink>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="#"
                  onClick={this.onClickLogout}
                >
                  <i className="nc-icon nc-lock-circle-open" />
                  <p>{t('logout')}</p>
                </a>
              </li>
              <li className="active-pro" key="manual">
                <a
                  href="/policy"
                  className="nav-link"
                  rel="noopener noreferrer"
                >
                  <i className="fa fa-question" />
                  <p>Privacy Policy</p>
                </a>
              </li>
            </Nav>
          </div>
        </div>
        {this.state.showMessageLoading && this.renderMessageLoading()}
      </>
    );
  }
}

export default withNamespaces()(Sidebar);
