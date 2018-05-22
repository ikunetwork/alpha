import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import Loader from './Loader';

const CryptoJS = require('crypto-js');
const Base64 = require('crypto-js/enc-base64');

export default class IPFSUploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      added_file_hash: null,
    };

    // Generating the key
    BigNumber.config({ CRYPTO: true });
    const rand = BigNumber.random().toNumber();
    const shaRand = CryptoJS.SHA256(rand + Date.now());
    this.encryption_key = Base64.stringify(shaRand);
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
      const encrypted = CryptoJS.AES.encrypt(
        reader.result,
        this.encryption_key
      );
      this.saveToIpfs(encrypted.toString());
    };

    reader.readAsText(file);
  }

  saveToIpfs(encrypted_content) {
    let ipfsId;
    const buffer = Buffer.from(encrypted_content);
    this.ipfs
      .add(buffer)
      .then(response => {
        ipfsId = response[0].hash;
        console.log('File uploaded to IPFS correctly with hash', ipfsId);
        this.setState({ added_file_hash: ipfsId });
        this.props.onUploadSuccess(ipfsId, this.encryption_key);
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
