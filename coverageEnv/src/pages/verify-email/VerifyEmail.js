import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import UrlHelper from '../../utils/UrlHelper';
import Loader from '../../components/Loader';

import { verifyEmailAction } from '../../redux/modules/signUp';

import './VerifyEmail.css';

class VerifyEmail extends Component {
  componentDidMount() {
    this.validate();
  }

  validate() {
    const params = UrlHelper.getParams();
    if (params.token) {
      this.props.verifyEmail(params.token);
    } else {
      window.location.href = '/';
    }
  }

  renderError() {
    const defaultError = (
      <p>
        Ooops! Something went wrong...<br />
        Please try again...
        <br />
      </p>
    );

    return (
      <div className="form-error mr-auto ml-auto text-center">
        {this.props.error ? this.props.error : defaultError}
      </div>
    );
  }

  renderSuccess() {
    if (!this.props.loading) {
      return (
        <div className="container col-md-6">
          <div className="row">
            <Loader />
          </div>
        </div>
      );
    }

    return (
      <div className="container col-md-6">
        <div className="row">
          <div className="ml-auto mr-auto text-center title">
            <h2>Your email has been verified!</h2>
          </div>
          <div className="ml-auto mr-auto text-center">
            <p>You can now start using the IKU platform.</p>
            <div className="title">
              <Link className="btn btn-iku btn-faucet" to="/proposals">
                View Proposals
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="wrapper">
        <div className="faq-page">
          <div className="section section-grey">
            {!this.props.error ? this.renderSuccess() : this.renderError()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.signUp.verifyingEmail,
    error: state.signUp.error,
  }),
  dispatch => ({
    verifyEmail: token => dispatch(verifyEmailAction(token)),
  })
)(VerifyEmail);
