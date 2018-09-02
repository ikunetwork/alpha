import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTokensAction } from '../../redux/modules/faucet';
import Loader from '../../components/Loader';
import Title from '../../components/Title';

import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../../redux/modules/web3';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

class ViewLicense extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.success && nextProps.success) {
      this.props.setAlert(
        'Hold tight... Your tokens are on the way! \n(It may take a couple of minutes to reflect your new balance)'
      );
      setTimeout(_ => {
        window.location.reload();
      }, 4000);
    }
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  getIKU() {
    if (this.props.web3) {
      if (!this.props.address) {
        this.props.showUnlockMetamaskModal(true);
      } else {
        this.props.getTokens(this.props.address);
      }
    } else {
      this.props.showNoWeb3BrowserModal(true);
    }
  }

  renderError() {
    return (
      <div className="form-error mr-auto ml-auto text-center">
        <p>{this.props.error}</p>
      </div>
    );
  }

  renderButton() {
    return (
      <div className="ml-auto mr-auto text-center title">
        <button
          type="button"
          className="btn btn-iku btn-faucet btn-big"
          onClick={_ => this.getIKU()}
        >
          {this.props.loading ? (
            <Loader size="small" />
          ) : (
            'Send me some tokens!'
          )}
        </button>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="container col-md-6">
        <Title align="center">Token License</Title>

        <div className="row form-wrapper">
          <p className="text-center mr-auto ml-auto">
            In order to access all the features of the IKU platform (ALPHA) you
            will need IKU tokens.
          </p>
          <br />
          <p className="text-center mr-auto ml-auto">
            By clicking the button below, we will send you 100 IKU tokens to
            your current ethereum address.
          </p>
          <br />
          <br />
          <br />
          {this.renderButton()}
        </div>
        {this.props.error ? this.renderError() : null}
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
    loading: state.faucet.loading,
    success: state.faucet.success,
  }),
  dispatch => ({
    getTokens: address => dispatch(getTokensAction(address)),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(ViewLicense);
