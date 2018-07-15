import React, { Component } from 'react';
import Loader from './Loader';

export default class IPFSUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added_file_hash: null,
    };
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const file = event.target.files[0];

    this.ipfs = window.IpfsApi('ipfs.infura.io', '5001', {
      protocol: 'https',
    });

    const reader = new window.FileReader();
    reader.onloadend = () => {
      this.saveToIpfs(reader.result.toString());
    };

    reader.readAsText(file);
  }

  saveToIpfs(content) {
    let ipfsId;
    const buffer = Buffer.from(content);
    this.ipfs
      .add(buffer)
      .then(response => {
        ipfsId = response[0].hash;
        console.log('File uploaded to IPFS correctly with hash', ipfsId);
        this.setState({ added_file_hash: ipfsId });
        this.props.onUploadSuccess(ipfsId);
      })
      .catch(err => {
        console.error(err);
      });
  }

  renderIPFSLink() {
    return (
      <p>
        File added to IPFS:{' '}
        <a
          href={`https://ipfs.io/ipfs/${this.state.added_file_hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.state.added_file_hash}
        </a>
      </p>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="upload">
          <input
            type="file"
            name={this.props.name}
            className="proposal-file-uploader"
            onChange={e => this.onChange(e)}
          />
        </div>
        {this.state.added_file_hash ? (
          this.renderIPFSLink()
        ) : this.state.loading ? (
          <Loader size="small" />
        ) : null}
      </div>
    );
  }
}
