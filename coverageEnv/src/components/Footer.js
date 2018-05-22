import React, { Component } from 'react';
import Network from './Network';

export default class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <footer className="footer bg-iku">
        <div className="container">
          <div className="row">
            <nav className="footer-nav" />
            <div className="credits ml-auto">
              <span className="copyright">
                © {new Date().getFullYear()}, made with{' '}
                <i className="fa fa-heart heart" /> by the IKU team
              </span>
            </div>
          </div>
        </div>
        <Network networkId={this.props.networkId} />
      </footer>
    );
  }
}
