import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Web3Helper from '../utils/Web3Helper';
import Wallet from './Wallet';
import Blocky from './Blocky';
import DeviceHelper from '../utils/DeviceHelper';
import { loginAction } from '../redux/modules/user';
import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../redux/modules/web3';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMobile: DeviceHelper.isMobile(),
    };
  }

  getDesktopItems() {
    const items = [];
    if (this.props.user.loggedIn) {
      items.push(
        <li key="hi" className="nav-item user">
          <Link to="/account" title="Account">
            <Blocky address={this.props.user.address} />{' '}
            <h4>
              <span>{this.props.user.first_name}</span>
            </h4>
          </Link>
        </li>
      );

      if (this.props.web3) {
        items.push(
          <li key="wallet" className="nav-item">
            <Link to="/account" title="Account">
              <Wallet web3={this.props.web3} address={this.props.address} />
            </Link>
          </li>
        );
      }
    } else {
      items.push(
        <li key="login" className="nav-item login">
          <button onClick={this.attemptLogin} className="nav-link interactive">
            Login
          </button>
        </li>
      );

      items.push(
        <li key="signup" className="nav-item signup">
          <Link to="/signup" className="nav-link btn btn-iku">
            Sign Up
          </Link>
        </li>
      );
    }

    return items;
  }

  getMobileItems() {
    const items = [];

    if (this.props.user.loggedIn) {
      items.push(
        <li key="user" className="nav-item">
          <Link to="/account" title="Account" onClick={this.closeNavbar}>
            <Blocky address={this.props.user.address} />{' '}
            <span>{this.props.user.first_name}</span>
          </Link>
        </li>
      );

      if (this.props.networkId) {
        items.push(
          <li key="network" className="nav-item nav-network">
            <i className="fa fa-sitemap" />{' '}
            {Web3Helper.getNetwork(this.props.networkId)}
          </li>
        );
      }

      if (this.props.web3) {
        items.push(
          <li key="wallet" className="nav-item">
            <Link to="/account" title="Account">
              <Wallet web3={this.props.web3} address={this.props.address} />
            </Link>
          </li>
        );
      }
    } else {
      if (this.props.networkId) {
        items.push(
          <li key="network" className="nav-item nav-network">
            <i className="fa fa-sitemap" />{' '}
            {Web3Helper.getNetwork(this.props.networkId)}
          </li>
        );
      }
      items.push(
        <li key="login" className="nav-item">
          <button onClick={this.attemptLogin} className="nav-link interactive">
            Login
          </button>
        </li>
      );

      items.push(
        <li key="signup" className="nav-item">
          <Link to="/signup" className="nav-link interactive">
            Sign Up
          </Link>
        </li>
      );
    }

    items.push(
      <li key="home" className="nav-item">
        <Link
          to="/"
          className="nav-link interactive"
          title="Home"
          onClick={this.closeNavbar}
        >
          Home
        </Link>
      </li>
    );

    items.push(
      <li key="proposals" className="nav-item">
        <Link
          to="/proposals"
          className="nav-link interactive"
          title="Proposals"
          onClick={this.closeNavbar}
        >
          Proposals
        </Link>
      </li>
    );

    items.push(
      <li key="faq" className="nav-item">
        <Link
          to="/faq"
          className="nav-link interactive"
          title="F.A.Q."
          onClick={this.closeNavbar}
        >
          F.A.Q.
        </Link>
      </li>
    );

    if (this.props.user.loggedIn) {
      items.push(
        <li key="logout" className="nav-item">
          <Link
            to="/"
            className="nav-link interactive"
            title="Logout."
            onClick={this.logoutAndClose}
          >
            Logout
          </Link>
        </li>
      );
    }

    return items;
  }

  getMenuItems() {
    if (!this.state.isMobile) {
      return this.getDesktopItems();
    } else {
      return this.getMobileItems();
    }
  }

  closeNavbar = () => {
    // Close the navbar after clicking on a link
    // TODO: track this side effect in redux
    document.getElementById('bodyClick').click();
  };

  login = () => {
    const { address, web3 } = this.props;
    if (address) {
      Web3Helper.signMessage(address, web3).then(sign => {
        this.props.login({ address, sign });
      });
    } else {
      console.log('Address unknown; cannot perform login request.');
    }
  };

  logoutAndClose = () => {
    this.closeNavbar();
    this.props.logout();
  };

  attemptLogin = () => {
    // this.props.web3.handleAction(this.login());
    if (this.props.web3) {
      if (!this.props.address) {
        this.props.showUnlockMetamaskModal(true);
      } else {
        this.login();
      }
    } else {
      this.props.showNoWeb3BrowserModal(true);
    }
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg top">
        <div className="container">
          <div className="navbar-translate">
            <button
              className="navbar-toggler navbar-burger"
              type="button"
              data-toggle="collapse"
              data-target="#navbarToggler"
              aria-controls="navbarTogglerDemo02"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-bar" />
              <span className="navbar-toggler-bar" />
              <span className="navbar-toggler-bar" />
              <span className="navbar-toggler-bar" />
              <span className="navbar-toggler-bar" />
            </button>

            <div className="logo">
              <img
                alt="iku.network logo"
                src="/assets/img/logo-sidebar.png"
                className="navbar-logo"
              />
              <h1>IKU</h1>
            </div>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">{this.getMenuItems()}</ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    login: params => dispatch(loginAction(params)),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
  })
)(Navbar);
