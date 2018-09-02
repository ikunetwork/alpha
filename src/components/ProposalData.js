import React, { Component } from 'react';
import IPFSUploader from './IPFSUploader';
import Loader from './Loader';

export default class ProposalData extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onUploadSuccess(ipfs_hash) {
    this.props.onUploadSuccess(ipfs_hash);
  }

  renderUploader() {
    if (this.props.isProposalOwner) {
      return (
        <div className="row">
          <div className="col-md-12">
            <h4>Upload research data</h4>
            <IPFSUploader
              onUploadSuccess={ipfs_hash => this.onUploadSuccess(ipfs_hash)}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    let data = [];
    const { ipfs_hash } = this.props.proposal;

    try {
      if (!Array.isArray(ipfs_hash)) {
        data = JSON.parse(ipfs_hash);
      } else {
        data = ipfs_hash;
      }
    } catch (e) {
      console.log(e);
    }

    return (
      <div className="proposal-data-upload">
        {this.renderUploader()}
        <div className="row">
          {data && data.length ? (
            <div className="col-md-12">
              {this.props.isProposalOwner ? <hr /> : null}
              <h4>Research data is available</h4>
              <ul className="datasets">
                {data.map((item, i) => (
                  <li key={item}>
                    <a
                      href={`https://ipfs.io/ipfs/${item}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Dataset #{i + 1} ({item})
                    </a>
                  </li>
                ))}
              </ul>
              <div className="request-license-wrapper">
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
            </div>
          ) : !this.props.isProposalOwner ? (
            <p>The proposal creator didn't upload any data yet...</p>
          ) : null}
        </div>
      </div>
    );
  }
}
