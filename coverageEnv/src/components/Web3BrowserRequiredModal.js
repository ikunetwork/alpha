import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DeviceHelper from '../utils/DeviceHelper';

export default class Web3BrowserRequiredModal extends Component {
  constructor(props) {
    super(props);
    this.isMobile = DeviceHelper.isMobile();
  }
  installMetamask() {
    window.open(
      'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'
    );
    this.props.onClose();
  }

  renderMobile = () => (
    <div className="modal-content no-web3-modal">
      <div className="modal-header no-border-header">
        <h5 className="modal-title" id="myModalLabel">
          You need a web3 compatible browser!
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
        <div className="instruction">
          <div className="row">
            <div className="col-md-12">
              <p className="small">
                We recommend you to use one of the following web3 mobile
                browsers:
              </p>
              <br />
            </div>
          </div>
        </div>
        <div className="instruction">
          <div className="row">
            <div className="col-md-12">
              <a
                href="https://www.cipherbrowser.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/img/cipher-logo.png"
                  alt="cipher logo"
                  className="cipher-logo"
                />
              </a>

              <a
                href="https://status.im/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/img/status-logo.png"
                  alt="status logo"
                  className="status-logo"
                />
              </a>
            </div>
          </div>
        </div>
        <br />
        <p className="small">
          If you have more questions, please don't hesitate to visit our{' '}
          <Link to="/faq" className="" onClick={_ => this.props.onClose()}>
            F.A.Q
          </Link>{' '}
          or <a href="mailto:support@iku.network">get in touch with us</a>
        </p>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-default btn-link"
          data-dismiss="modal"
          onClick={_ => this.props.onClose()}
        >
          Got it
        </button>
      </div>
    </div>
  );

  renderDesktop = () => (
    <div className="modal-content">
      <div className="modal-header no-border-header">
        <h5 className="modal-title" id="myModalLabel">
          You need to install Metamask!
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
        <div className="instruction">
          <div className="row">
            <div className="col-md-12">
              <p className="small">
                <strong>Note:</strong> A digital wallet like MetaMask acts like
                a bank account. Treat it with respect and make sure you don’t
                forget your password or the seed words.
              </p>
            </div>
          </div>
        </div>
        <div className="instruction">
          <div className="row">
            <div className="col-md-12">
              <iframe
                width="100%"
                height="280"
                src="https://www.youtube.com/embed/tfETpi-9ORs?rel=0&amp;showinfo=0"
                frameBorder="0"
                allowFullScreen=""
                title="youtube"
              />
            </div>
          </div>
        </div>
        <p className="small">
          If you have more questions, please don't hesitate to visit our{' '}
          <Link to="/faq" className="" onClick={_ => this.props.onClose()}>
            F.A.Q
          </Link>{' '}
          or <a href="mailto:support@iku.network">get in touch with us</a>
        </p>
      </div>
      <div className="modal-footer">
        <div className="left-side">
          <button
            type="button"
            className="btn btn-default btn-link"
            data-dismiss="modal"
            onClick={_ => this.props.onClose()}
          >
            I'll do it later
          </button>
        </div>
        <div className="divider" />
        <div className="right-side">
          <button
            type="button"
            className="btn btn-default btn-link"
            data-dismiss="modal"
            onClick={_ => this.installMetamask()}
          >
            INSTALL METAMASK
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div
        className={`metamask modal fade ${this.props.show ? 'show' : ''}`}
        id="noticeModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-notice">
          {this.isMobile ? this.renderMobile() : this.renderDesktop()}
        </div>
      </div>
    );
  }
}
