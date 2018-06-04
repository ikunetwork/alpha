import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Currency from '../utils/Currency';
import Loader from './Loader';
import EtherscanUrlHelper from '../utils/EtherscanUrlHelper';

export default class ContributeModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
    };
  }

  setValue(event) {
    const { target } = event;
    const { value, name } = target;
    this.setState({
      [name]: value,
    });
  }

  getTokens() {
    if (this.state.amount === '' || Number.isNaN(this.state.amount)) {
      return (
        <div className="exchange">
          <div className="row label">
            <p>The current exchange rate is: </p>
          </div>
          <div className="row amount">
            <h6>
              1 ETH = {this.calculateTokenAmount(1)} {this.props.tokenSymbol}
            </h6>
          </div>
        </div>
      );
    }

    return (
      <div className="exchange">
        <div className="row label">
          <p>in exchange you will get </p>
        </div>
        <div className="row amount">
          <h6>
            {this.calculateTokenAmount(this.state.amount)}{' '}
            {this.props.tokenName} ({this.props.tokenSymbol}) tokens
          </h6>
        </div>
      </div>
    );
  }

  calculateTokenPrice(amount) {
    const tokens = amount / this.props.rate;
    return Currency.formatETH(tokens.toString());
  }

  calculateTokenAmount(amount) {
    const tokens = this.props.rate * amount;
    return Currency.formatTokens(tokens.toString());
  }

  contribute() {
    if (
      this.state.amount !== '' &&
      !Number.isNaN(this.state.amount) &&
      this.state.amount > 0
    ) {
      this.props.onContribute(this.state.amount);
    } else {
      alert('Please enter a valid amount');
    }
  }

  renderForm() {
    return (
      <div>
        <div className="modal-header no-border-header">
          <h5 className="modal-title" id="myModalLabel">
            Contribute to this proposal
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={_ => this.props.onClose()}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="row price-row">
            <div className="col-md-8">
              <div className="input-group border-input">
                <input
                  type="number"
                  placeholder=" Enter amount"
                  className="form-control border-input"
                  name="amount"
                  value={this.state.amount}
                  onChange={e => this.setValue(e)}
                />
                <span className="input-group-addon input-group-label">ETH</span>
              </div>
            </div>
            <div className="col-md-4">
              <button
                type="button"
                className="btn btn-iku btn-contribute"
                onClick={_ => this.contribute()}
              >
                {this.props.loading ? <Loader size="small" /> : 'Contribute!'}
              </button>
            </div>
          </div>
          {this.getTokens()}
        </div>
        <div className="modal-footer">
          <div className="row">
            <p className="small">
              If you have more questions, please don't hesitate to visit our{' '}
              <Link to="/faq" className="" onClick={_ => this.props.onClose()}>
                F.A.Q
              </Link>{' '}
              or <a href="mailto:support@iku.network">get in touch with us</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  renderSuccess() {
    return (
      <div>
        <div className="modal-header no-border-header">
          <h5 className="modal-title" id="myModalLabel">
            Thanks for contributing!
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={_ => this.props.onClose()}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="exchange">
            <div className="row label success">
              <p>You have received</p>
            </div>
            <div className="row amount">
              <h6>
                {this.calculateTokenAmount(this.state.amount)}{' '}
                {this.props.tokenName} ({this.props.tokenSymbol}) tokens
              </h6>
            </div>
            <p>
              <a
                href={`${EtherscanUrlHelper.getTxUrl(
                  this.props.contributionTx,
                  this.props.networkId
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="etherscan-link"
              >
                View your transaction details on EtherScan.io
              </a>
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <div className="row">
            <p className="small">
              If you have more questions, please don't hesitate to visit our{' '}
              <Link to="/faq" className="" onClick={_ => this.props.onClose()}>
                F.A.Q
              </Link>{' '}
              or <a href="mailto:support@iku.network">get in touch with us</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div
        className={`contribute modal fade ${this.props.show ? 'show' : ''}`}
        id="noticeModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-notice">
          <div className="modal-content">
            {this.props.success ? this.renderSuccess() : this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}
