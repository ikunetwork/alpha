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

class UpdateLicense extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.props.success && nextProps.success) {
      this.props.setAlert('Hold tight... The license is being updated now');
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
        <Title align="center">License Manager</Title>

        <div className="form-wrapper">
          <div className="row ">
            <p className="text-center mr-auto ml-auto">
              Here you can manage the license attached to our Token.
              <br />
              <br />
            </p>
          </div>
          <div className="container col-md-10 col-sm-12">
            <div className="row">
              <div className="col-md-12 col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.first_name}
                    placeholder="First Name"
                    onChange={e => this.setValue(e, 'first_name')}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.last_name}
                    placeholder="Last Name"
                    onChange={e => this.setValue(e, 'last_name')}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={this.state.email}
                    placeholder="Email"
                    onChange={e => this.setValue(e, 'email')}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    placeholder="Username"
                    onChange={e => this.setValue(e, 'username')}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="organization"
                    value={this.state.organization}
                    placeholder="Company, Organization or Institution"
                    onChange={e => this.setValue(e, 'organization')}
                  />
                </div>
              </div>
            </div>
            {!this.props.loading ? this.renderButton() : <Loader />}
          </div>
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
    loading: state.license.loading,
    success: state.license.success,
  }),
  dispatch => ({
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(UpdateLicense);
