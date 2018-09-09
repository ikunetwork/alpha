import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLicenseAction } from '../../redux/modules/license';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import IPFSUploader from '../../components/IPFSUploader';
import './License.css';

import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../../redux/modules/web3';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

class UpdateLicense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      ip_description: '',
      license_type: '',
      license_url: '',
      copyright: '',
      territory: '',
      public_benefit: '',
      commercialization: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.success && nextProps.success) {
      window.location.href = window.location.href.replace('update', 'view');
    }
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  onUploadSuccess = ipfs_hash => {
    console.log(`hash update ${ipfs_hash}`);
    this.setState({ license_url: `https://ipfs.io/ipfs/${ipfs_hash}` });
  };

  setValue(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  updateLicense = () => {
    const metadata = { ...this.state };
    const buffer = Buffer.from(JSON.stringify(metadata));
    this.ipfs = window.IpfsApi('ipfs.infura.io', '5001', { // eslint-disable-line
      protocol: 'https',
    });
    this.ipfs
      .add(buffer)
      .then(response => {
        const ipfsId = response[0].hash;
        console.log(`tokenUri: https://ipfs.io/ipfs/${ipfsId}`);
        this.props
          .updateLicense(`https://ipfs.io/ipfs/${ipfsId}`)
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });
  };

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
          onClick={this.updateLicense}
        >
          {this.props.loading ? <Loader size="small" /> : 'Update License'}
        </button>
      </div>
    );
  }

  renderLicenseField() {
    if (this.state.license_url) {
      return (
        <p>
          License:{' '}
          <a
            href={this.state.license_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.state.license_url}
          </a>
        </p>
      );
    } else {
      return (
        <div>
          <p>Choose the license txt file:</p>
          <IPFSUploader onUploadSuccess={this.onUploadSuccess} />
        </div>
      );
    }
  }

  renderContent() {
    return (
      <div className="license-page container col-md-8">
        <Title align="center">IKU Token License Manager</Title>

        <div className="form-wrapper">
          <div className="row">
            <p className="text-center mr-auto ml-auto">
              Here you can manage the license attached to our Token.
              <br />
              <br />
            </p>
          </div>
          <div className="row ">
            <div className="col-md-12 col-sm-6" />
            {this.renderLicenseField()}
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.name}
                  placeholder="Name"
                  onChange={e => this.setValue(e, 'name')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="ip_description"
                  value={this.state.ip_description}
                  placeholder="IP Description"
                  onChange={e => this.setValue(e, 'ip_description')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="license_type"
                  value={this.state.license_type}
                  placeholder="License Type"
                  onChange={e => this.setValue(e, 'license_type')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="copyright"
                  value={this.state.copyright}
                  placeholder="Copyright"
                  onChange={e => this.setValue(e, 'copyright')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="territory"
                  value={this.state.territory}
                  placeholder="Territory"
                  onChange={e => this.setValue(e, 'territory')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-check">
                <label htmlFor="public_benefit" className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="public_benefit"
                    id="public_benefit"
                    checked={this.state.public_benefit ? 'checked' : ''}
                    onChange={e => this.setValue(e)}
                    value="true"
                  />
                  Public Benefit
                  <span className="form-check-sign" />
                </label>
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          <div className="row">
            <div className="field-row col-md-12 col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="commercialization"
                  value={this.state.commercialization}
                  placeholder="Commercialization"
                  onChange={e => this.setValue(e, 'commercialization')}
                />
              </div>
            </div>
          </div>
          <div className="row row-separator" />
          {this.props.error ? this.renderError() : null}
        </div>
        {!this.props.loading ? this.renderButton() : <Loader />}
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
    updateLicense: data => dispatch(updateLicenseAction(data)),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(UpdateLicense);
