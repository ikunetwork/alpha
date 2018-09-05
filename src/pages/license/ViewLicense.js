import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { getLicenseAction } from '../../redux/modules/license';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import IkuTokenHelper from '../../utils/IkuTokenHelper';

import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../../redux/modules/web3';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

class ViewLicense extends Component {
  constructor(props) {
    super(props);
    this.state = { license: '' };
  }

  componentDidMount = () => {
    // if (this.props.address) {
    setTimeout(_ => {
      this.getLicense();
    }, 1000);
    // }
  };

  componentWillUnmount() {
    this.props.clearAlert();
  }

  getLicense() {
    if (this.props.web3) {
      if (!this.props.address) {
        this.props.showUnlockMetamaskModal(true);
      } else {
        IkuTokenHelper.getLicense(web3.currentProvider).then(license => {
          this.setState({ license });
        });
      }
    } else {
      this.props.showNoWeb3BrowserModal(true);
    }
  }

  renderContent() {
    return (
      <div className="container col-md-10">
        <Title align="center">IKU Token Metadata</Title>
        <h5 className="text-center mr-auto ml-auto subtitle">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={this.state.license.license}
          >
            License: {this.state.license.license}
          </a>
        </h5>
        <br />
        <br />
        <div className="form-wrapper">
          <div className="row">
            {!this.state.license ? (
              <Loader size="small" />
            ) : (
              <ReactJson src={this.state.license} />
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapper">
        <div className="faq-page">
          <div className="section section-grey">{this.renderContent()}</div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.license.loading,
    success: state.license.success,
  }),
  dispatch => ({
    getLicense: _ => dispatch(getLicenseAction()),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(ViewLicense);
