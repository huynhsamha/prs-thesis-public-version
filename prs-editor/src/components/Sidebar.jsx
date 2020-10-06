import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';
import PerfectScrollbar from 'perfect-scrollbar';
import { withNamespaces } from 'react-i18next';

import brand from '../assets/icons/favicon.png';
import { confirmWarning, alertError } from '../utils/customAlert';
import { logout } from '../api';

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
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

  render() {
    const { t } = this.props;
    return (
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
            <li className={this.activeRoute('/polls')}>
              <NavLink
                to={'/polls'}
                className="nav-link"
                activeClassName="active"
              >
                <i className="nc-icon nc-money-coins" />
                <p>Poll Storage</p>
              </NavLink>
            </li>
            <li className={this.activeRoute('/sessions', false, ['new'])}>
              <NavLink
                to={'/sessions'}
                className="nav-link"
                activeClassName="active"
              >
                <i className="nc-icon nc-calendar-60" />
                <p>Session</p>
              </NavLink>
            </li>
            <li className={this.activeRoute('/sessions/new', true)}>
              <NavLink
                to={'/sessions/new'}
                className="nav-link"
                activeClassName="active"
              >
                <i className="nc-icon nc-simple-add" />
                <p>New Session</p>
              </NavLink>
            </li>
            {/* <li className={this.activeRoute('/icons')}>
              <NavLink
                to={'/icons'}
                className="nav-link"
                activeClassName="active"
              >
                <i className="nc-icon nc-money-coins" />
                <p>Icons</p>
              </NavLink>
            </li> */}
            <li>
              <a
                className="nav-link"
                href="#"
                onClick={() => {
                  confirmWarning(t('message.confirm.logout')).then(ok => {
                    if (ok) {
                      logout()
                        .then(() => {
                          window.location.reload();
                        })
                        .catch(err => {
                          alertError(t('message.common.error'));
                        });
                    }
                  });
                }}
              >
                <i className="nc-icon nc-lock-circle-open" />
                <p>{t('logout')}</p>
              </a>
            </li>
            {/* <li className="active-pro" key="manual">
              <a
                href="/"
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa fa-question" />
                <p>{t('guide')}</p>
              </a>
            </li> */}
          </Nav>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Sidebar);
