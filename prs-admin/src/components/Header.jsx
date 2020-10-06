import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from 'reactstrap';
import { logout } from '../api';
import { confirmWarning, alertError } from '../utils/customAlert';

import i18n from '../i18n';
import { withNamespaces } from 'react-i18next';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: 'transparent',
      user: null,
      langOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
  }

  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: 'transparent'
      });
    } else {
      this.setState({
        color: 'dark'
      });
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleLang(e) {
    this.setState({
      langOpen: !this.state.langOpen
    });
  }

  getBrand() {
    const pathname = this.props.location.pathname;
    if (pathname === '/editors') return 'Editors';
    if (pathname === '/editors/new') return 'New Editors';
    if (pathname === '/audience/new') return 'New Audience';
    if (pathname === '/audiences') return 'Audiences';
    if (pathname === '/audiences/ban') return 'Ban Audiences';
    return '';
  }

  openSidebar() {
    document.documentElement.classList.toggle('nav-open');
    this.refs.sidebarToggle.classList.toggle('toggled');
  }

  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: 'dark'
      });
    } else {
      this.setState({
        color: 'transparent'
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateColor.bind(this));
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf('nav-open') !== -1
    ) {
      document.documentElement.classList.toggle('nav-open');
      this.refs.sidebarToggle.classList.toggle('toggled');
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Navbar
        color={
          this.props.location.pathname.indexOf('full-screen-maps') !== -1
            ? 'dark'
            : this.state.color
        }
        expand="lg"
        className={
          this.props.location.pathname.indexOf('full-screen-maps') !== -1
            ? 'navbar-absolute fixed-top'
            : 'navbar-absolute fixed-top ' +
              (this.state.color === 'transparent' ? 'navbar-transparent ' : '')
        }
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref="sidebarToggle"
                className="navbar-toggler"
                onClick={() => this.openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className="justify-content-end"
          >
            <Nav navbar>
              <NavItem>
                <a className="nav-link" style={{ textTransform: 'initial' }}>
                  <i className="fa fa-user-alt" />
                  <p>
                    <span className="">{(this.state.user || {}).name}</span>
                  </p>
                </a>
              </NavItem>
              <NavItem
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
                <a
                  className="nav-link btn-rotate"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="nc-icon nc-lock-circle-open" />
                  <p>
                    <span className="d-md-block">{t('logout')}</span>
                  </p>
                </a>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withNamespaces()(Header);
