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
import { logout, getUserInfo } from '../api';
import { confirmWarning, alertError } from '../utils/customAlert';

import i18n from '../i18n';
import { getMyProfile } from '../utils/storage';
import { withNamespaces } from 'react-i18next';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: 'transparent',
      langOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);

    this.user = {};
    this.defaultAvatar = '/default-avatar.png';

    this.getProfile();
  }

  getProfile() {
    getMyProfile()
      .then(profile => {
        console.log(profile);
        this.setState({ user: profile });
      })
      .catch(err => {
        console.log(err);
      });
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
    if (pathname === '/polls') return 'Poll Storage';
    if (pathname.includes('polls')) return 'Edit Poll';
    if (pathname === '/sessions') return 'Session';
    if (pathname === '/sessions/new') return 'New Session';
    if (pathname.includes('sessions') && pathname.includes('detail'))
      return 'Session Detail';
    if (pathname.includes('sessions')) return 'Edit Session';
    if (pathname === '/icons') return 'Icons';
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
              {/* <Dropdown
                nav
                isOpen={this.state.langOpen}
                toggle={e => this.toggleLang(e)}
              >
                <DropdownToggle caret nav>
                  <i className="nc-icon nc-settings" />
                </DropdownToggle>
                <DropdownMenu
                  right
                  style={{ minWidth: '6rem', transitionDuration: '0s' }}
                >
                  <DropdownItem
                    tag="a"
                    onClick={() => i18n.changeLanguage('vi')}
                  >
                    <img
                      src="https://raw.githubusercontent.com/hjnilsson/country-flags/master/png250px/vn.png"
                      alt="VI"
                      height="18"
                      width="30"
                      className="mr-2"
                    />
                    VI
                  </DropdownItem>
                  <DropdownItem
                    tag="a"
                    onClick={() => i18n.changeLanguage('en')}
                  >
                    <img
                      src="https://raw.githubusercontent.com/hjnilsson/country-flags/master/png250px/us.png"
                      alt="EN"
                      height="18"
                      width="30"
                      className="mr-2"
                    />
                    EN
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown> */}

              <NavItem>
                <a className="nav-link" style={{ textTransform: 'initial' }}>
                  {/* <i className="fa fa-user-alt" /> */}
                  <p className="" style={{ fontSize: '18px' }}>
                    <span className="mr-2">
                      {(this.state.user || {}).displayName}
                    </span>
                  </p>
                  <img
                    src={(this.state.user || {}).avatar || this.defaultAvatar}
                    alt="Avatar"
                    width={36}
                    style={{ borderRadius: '50%' }}
                  />
                </a>
              </NavItem>
              {/* <NavItem
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
              </NavItem> */}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withNamespaces()(Header);
