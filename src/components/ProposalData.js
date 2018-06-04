import React, { Component } from 'react';
import IPFSUploader from './IPFSUploader';
import Loader from './Loader';

export default class ProposalData extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onUploadSuccess(ipfs_hash, encryption_key) {
    this.props.onUploadSuccess(ipfs_hash, encryption_key);
  }

  renderUploader() {
    if (this.props.isProposalOwner) {
      return (
        <div>
          <div className="row">
            <h4>Upload research data</h4>
          </div>
          <IPFSUploader
            onUploadSuccess={(ipfs_hash, encryption_key) =>
              this.onUploadSuccess(ipfs_hash, encryption_key)
            }
          />
          <div className="row">
            <hr />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="proposal-data-upload">
        {this.renderUploader()}

        <div className="row">
          {this.props.proposal.ipfs_hash ? (
            <div>
              <h4>Research data is available</h4>
              <br />
              <br />
              <button
                className="btn btn-iku"
                onClick={_ => this.props.requestAccessToData()}
              >
                {this.props.accessingData ? (
                  <Loader size="small" />
                ) : (
                  'Request access to data'
                )}
              </button>

              <button
                className="btn btn-iku"
                href={`https://ipfs.io/ipfs/${this.props.proposal.ipfs_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={_ => this.props.requestAccessToLicense()}
              >
                {this.props.accessingLicense ? (
                  <Loader size="small" />
                ) : (
                  'Request access to License'
                )}
              </button>
            </div>
          ) : !this.props.isProposalOwner ? (
            <p>The proposal creator didn't upload any data yet...</p>
          ) : null}
        </div>
      </div>
    );
  }
}
