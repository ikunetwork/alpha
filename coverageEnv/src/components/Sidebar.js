import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderLogout() {
    if (this.props.user.loggedIn) {
      return (
        <li className="nav-item">
          <span className="nav-link interactive" title="Logout">
            <button className="btn btn-just-icon" onClick={this.props.logout}>
              <i className="fa fa-sign-out" />
            </button>
            <span>Logout</span>
          </span>
        </li>
      );
    }
  }

  render() {
    return (
      <div className="sidebar fixed-left">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" title="Home">
              <button className="btn btn-just-icon">
                <i className="fa fa-home" />
              </button>
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/proposals" className="nav-link" title="Proposals">
              <button className="btn btn-just-icon">
                <i className="fa fa-file-text-o" />
              </button>
              <span>Proposals</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/faq" className="nav-link" title="F.A.Q.">
              <button className="btn btn-just-icon">
                <i className="fa fa-question" />
              </button>
              <span>F.A.Q.</span>
            </Link>
          </li>
          {this.renderLogout()}
        </ul>
      </div>
    );
  }
}
