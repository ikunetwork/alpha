import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import Web3Helper from '../../utils/Web3Helper';
import Config from '../../utils/Config';
import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../../redux/modules/web3';

import {
  signupAction,
  resendSignupEmailAction,
} from '../../redux/modules/signUp';

import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      organization: '',
    };
  }

  setValue(e, name) {
    const data = {};
    data[name] = e.target.value;
    this.setState(data);
  }

  validateWeb3() {
    if (this.props.web3) {
      if (!this.props.address) {
        this.props.showUnlockMetamaskModal(true);
      } else {
        return true;
      }
    } else {
      this.props.showNoWeb3BrowserModal(true);
    }

    return false;
  }

  signup = () => {
    if (this.validateWeb3()) {
      // Sign
      Web3Helper.signMessage(
        this.props.address,
        this.props.web3,
        Config.SIGN_IN_MESSAGE
      )
        .then(sign => {
          const {
            first_name,
            last_name,
            email,
            username,
            organization,
          } = this.state;
          this.props.signup({
            address: this.props.address,
            sign,
            fields: {
              first_name,
              last_name,
              email,
              username,
              organization,
            },
          });
        })
        .catch(err => {
          console.log('error while signing with metamask', err);
        });
    }
  };

  resendEmail = () => {
    this.props.resendEmail(this.props.address);
  };

  renderError() {
    const defaultError = (
      <p>
        Ooops! Something went wrong...<br />
        Please try again...
        <br />
      </p>
    );

    // TODO: decide error messaging

    return (
      <div className="form-error mr-auto ml-auto text-center">
        {this.props.error || defaultError}
      </div>
    );
  }

  renderForm() {
    return (
      <div>
        <div className="container col-md-5 col-sm-12">
          <div className="row">
            <div className="ml-auto mr-auto text-center title">
              <h2>Sign up for IKU Alpha</h2>
            </div>
            {this.props.error ? this.renderError() : null}
          </div>
          <div className="form-wrapper">
            <div className="row ">
              <p className="text-center mr-auto ml-auto">
                Enter the following information in order to signup for the IKU
                platform
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
        </div>
      </div>
    );
  }

  renderButton() {
    return (
      <div className="ml-auto mr-auto text-center title">
        <button
          type="button"
          className="btn btn-iku btn-big"
          onClick={this.signup}
        >
          Signup
        </button>
      </div>
    );
  }

  renderSuccess() {
    return (
      <div className="container col-md-6">
        <div className="row">
          <div className="ml-auto mr-auto text-center title">
            <h2>Thanks for signing up!</h2>
          </div>
          <p className="text-center mr-auto ml-auto">
            In order to start using our platform you need to verify your email.
            <br />
            Please check your email and click in the verification link.
            <br />
            If you didn't receive the email,{' '}
            <button className="btn-a interactive" onClick={this.resendEmail}>
              click here to resend it
            </button>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapper">
        <div className="faq-page">
          <div className="section section-grey">
            {this.props.done ? this.renderSuccess() : this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.signUp.loading,
    error: state.signUp.error,
    done: state.signUp.done,
  }),
  dispatch => ({
    signup: params => dispatch(signupAction(params)),
    resendEmail: address => dispatch(resendSignupEmailAction(address)),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
  })
)(Signup);
