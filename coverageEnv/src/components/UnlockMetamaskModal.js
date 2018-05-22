import React, { PureComponent } from 'react';

export default class UnlockMetamaskModal extends PureComponent {
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
          <div className="modal-content">
            <div className="modal-header no-border-header">
              <h5 className="modal-title" id="myModalLabel">
                You need to unlock Metamask!
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
                      Simply open MetaMask and follow the instructions to unlock
                      it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="instruction">
                <div className="row">
                  <div className="col-md-12">
                    <img
                      src="/assets/img/unlock-metamask.png"
                      alt="unlock-metamask"
                      width="50%"
                    />
                  </div>
                </div>
              </div>
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
        </div>
      </div>
    );
  }
}
