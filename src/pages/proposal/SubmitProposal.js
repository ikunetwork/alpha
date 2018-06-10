import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Loader from '../../components/Loader';
import Title from '../../components/Title';
import Error401 from '../../pages/error/Error401';
import S3FileUploader from '../../components/S3FileUploader';
import Currency from '../../utils/Currency';

import {
  submitProposalAction,
  clearSubmissionDataAction,
} from '../../redux/modules/proposals';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

import './SubmitProposal.css';

class SubmitProposal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: '',
      rare_disease: false,
      thesis: '',
      current_stage: '',
      observations: '',
      socioeconomic_implication: '',
      investigator_name: '',
      investigator_location: '',
      funds_required: '',
      funding_process_duration: '',
      token_name: '',
      token_symbol: '',
      roadmap: '',
      empirical_data: '',
      anecdotal_data: '',
      scientific_justification: '',
      image: '/assets/img/not-available.jpg',
      attachments: [],
      certify: false,
      eth_price_usd: 0,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.isEditing() &&
      !this.state.id &&
      nextProps.proposals &&
      nextProps.proposals.length > 0
    ) {
      this.loadProposalInfo(nextProps);
    }
  }
  
  componentWillUnmount() {
    this.props.clearAlert();
  }

  onImageUploaded(image) {
    this.setState({ image: image.url });
  }

  onImageUploadError = msg => {
    console.log('Upload failed:', msg);
  };

  onAttachmentUploaded = attachment => {
    this.setState({
      attachments: [...this.state.attachments, attachment],
    });
  };

  onAttachmentUploadError = msg => {
    console.log('Upload failed:', msg);
  };

  getProposalId = () => window.location.pathname.replace('/edit-proposal/', '');

  getProposalInfo(props) {
    const id = this.getProposalId();
    if (id !== '') {
      return (
        props.proposals && props.proposals.find(p => p.id === parseInt(id, 10))
      );
    }
    return null;
  }

  setValue(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  getDollarAmount() {
    return Currency.formatUSD(
      Currency.ethToUSD(
        this.state.funds_required,
        this.state.eth_price_usd
      ).toNumber()
    );
  }

  loadProposalInfo(props) {
    const info = this.getProposalInfo(props);
    if (info) {
      let { attachments } = info;
      if (typeof attachments === 'string') {
        try {
          attachments = JSON.parse(attachments);
        } catch (e) {
          console.log('Error trying to parse attachments', e);
          attachments = [];
        }
      } else if (typeof attachments !== 'object') {
        attachments = [];
      }
      info.attachments = attachments;
      this.setState({ ...info });
    }
  }

  isEditing() {
    const id = this.getProposalId();
    if (id !== '') {
      return true;
    }
    return false;
  }

  async init() {
    this.props.clearSubmissionData();
    this.setState({ eth_price_usd: await Currency.getEtherPriceInUSD() });
    this.loadProposalInfo(this.props);
  }

  submitProposal = () => {
    if (!this.state.certify) {
      this.props.setAlert(
        'You need to certify that the information given is complete and correct'
      );
      return false;
    }
    const {
      name,
      rare_disease,
      thesis,
      current_stage,
      observations,
      socioeconomic_implication,
      investigator_name,
      investigator_location,
      funds_required,
      funding_process_duration,
      token_name,
      token_symbol,
      roadmap,
      empirical_data,
      anecdotal_data,
      scientific_justification,
      image,
      attachments,
    } = this.state;

    const data = {
      name,
      rare_disease,
      thesis,
      current_stage,
      observations,
      socioeconomic_implication,
      investigator_name,
      investigator_location,
      funds_required,
      funding_process_duration,
      token_name,
      token_symbol,
      roadmap,
      empirical_data,
      anecdotal_data,
      scientific_justification,
      image,
      attachments,
    };

    if (this.state.id) {
      data.id = this.state.id;
    }
    this.props.submitProposal(data, this.props.address);
  };

  deleteAttachment(i) {
    const attachments = this.state.attachments.slice();
    attachments.splice(i, 1);

    this.setState({ attachments });
  }

  renderError = () => (
    <div className="form-error">
      <p>
        There was an error while trying to submit your proposal.<br />
        Please try again...
        <br />
      </p>
    </div>
  );

  renderAttachments() {
    if (this.state.attachments && this.state.attachments.length) {
      return (
        <ul>
          {this.state.attachments.map((item, i) => (
            <li key={`attachment-${i.toString()}`}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment"
              >
                <i className="fa fa-file-o" /> {item.original_filename}
              </a>
              <button
                className="delete-attachment"
                onClick={_ => this.deleteAttachment(i)}
              >
                <i className="fa fa-times" />
              </button>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }

  renderForm() {
    return (
      <div className="container col-ld-8 col-md-12 proposal-form col-sm-12">
        <Title align="center">
          {this.isEditing() ? 'Edit' : 'Submit'} Proposal
        </Title>
        <div className="form-wrapper">
          <div className="row">
            <p>
              Please enter the following information in order to submit a new
              Proposal to the IKU network.
              <br />
            </p>
            {this.props.error ? this.renderError() : null}
          </div>
          <div className="form-section-header">
            <h4>General information</h4>
          </div>

          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Name <span className="icon-danger">*</span>
              </h6>
              <input
                type="text"
                className="form-control border-input"
                placeholder="Enter the name of the proposal"
                name="name"
                value={this.state.name}
                onChange={e => this.setValue(e)}
              />
            </div>
            <div className="col-md-6">
              <div className="form-check">
                <label htmlFor="rare_disease" className="form-check-label">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rare_disease"
                    id="rare_disease"
                    checked={this.state.rare_disease ? 'checked' : ''}
                    onChange={e => this.setValue(e)}
                    value="true"
                  />
                  Rare Disease?
                  <span className="form-check-sign" />
                </label>
              </div>
            </div>
          </div>

          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Proposition Thesis <span className="icon-danger">*</span>
              </h6>
              <input
                type="text"
                className="form-control border-input"
                placeholder="Enter the Proposition Thesis"
                name="thesis"
                value={this.state.thesis}
                onChange={e => this.setValue(e)}
              />
            </div>

            <div className="col-md-6">
              <h6>
                Current Stage <span className="icon-danger">*</span>
              </h6>
              <input
                type="text"
                className="form-control border-input"
                placeholder="Enter the current stage"
                name="current_stage"
                value={this.state.current_stage}
                onChange={e => this.setValue(e)}
              />
            </div>
          </div>

          <div className="form-group">
            <h6>Observations</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder=""
              rows="6"
              name="observations"
              value={this.state.observations}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-group">
            <h6>Socioeconomic Implication</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder=""
              rows="6"
              name="socioeconomic_implication"
              value={this.state.socioeconomic_implication}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-section-header">
            <h4>Information about the Principal Investigator</h4>
          </div>
          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Name <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="text"
                  placeholder="Enter the name of the principal investigator"
                  className="form-control border-input"
                  name="investigator_name"
                  value={this.state.investigator_name}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <h6>
                Location <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="text"
                  placeholder="Enter the location of the principal investigator"
                  className="form-control border-input"
                  name="investigator_location"
                  value={this.state.investigator_location}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>

          <div className="form-section-header">
            <h4>Funding</h4>
          </div>
          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Token Name <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="text"
                  placeholder="Enter the name of the token"
                  className="form-control border-input"
                  name="token_name"
                  value={this.state.token_name}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <h6>
                Token Symbol <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="text"
                  placeholder="Token Symbol"
                  className="form-control border-input"
                  name="token_symbol"
                  value={this.state.token_symbol}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Funds required (ETH)
                <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="text"
                  placeholder="enter amount in ETH"
                  className="form-control border-input"
                  name="funds_required"
                  value={this.state.funds_required}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="conversion-rate-helper">
                Conversion Rate: 1 ETH = ${this.state.eth_price_usd} USD
              </div>
            </div>
          </div>
          <div className="row price-row">
            <div className="col-md-12">
              <div className="conversion-rate-usd">
                {this.state.eth_price_usd > 0 && this.state.funds_required > 0
                  ? `You will be receiving around $${this.getDollarAmount()} USD`
                  : ''}
              </div>
            </div>
          </div>

          <div className="row price-row">
            <div className="col-md-6">
              <h6>
                Funding process duration <span className="icon-danger">*</span>
              </h6>
              <div className="input-group border-input">
                <input
                  type="number"
                  placeholder="Enter the amount of days"
                  className="form-control border-input"
                  name="funding_process_duration"
                  value={this.state.funding_process_duration}
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <h6>Roadmap</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder="Explain how do you plan to use the funds received"
              rows="6"
              name="roadmap"
              value={this.state.roadmap}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-section-header">
            <h4>Data</h4>
          </div>

          <div className="form-group">
            <h6>Empirical Data</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder=""
              rows="6"
              name="empirical_data"
              value={this.state.empirical_data}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-group">
            <h6>Anectodal Data</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder=""
              rows="6"
              name="anecdotal_data"
              value={this.state.anecdotal_data}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-group">
            <h6>Scientific Justification</h6>
            <textarea
              className="form-control textarea-limited"
              placeholder=""
              rows="6"
              name="scientific_justification"
              value={this.state.scientific_justification}
              onChange={e => this.setValue(e)}
            />
          </div>

          <div className="form-section-header">
            <h4>Media</h4>
          </div>

          <div className="row price-row">
            <div className="col-md-6">
              <h6>Image</h6>
              <div
                className="fileinput fileinput-new text-center"
                data-provides="fileinput"
              >
                <div className="fileinput-new thumbnail img-no-padding">
                  <img src={this.state.image} alt="..." />
                </div>
                <div className="fileinput-preview fileinput-exists thumbnail img-no-padding" />
                <div>
                  <S3FileUploader
                    name="image"
                    className="btn btn-iku btn-round btn-file"
                    onUploadSuccess={url => this.onImageUploaded(url)}
                    onUploadError={msg => this.onImageUploadError(msg)}
                  >
                    <span className="fileinput-new">
                      <i className="fa fa-plus" /> Select image
                    </span>
                  </S3FileUploader>
                </div>
              </div>
            </div>
            <div className="col-md-6 attachments">
              <h6>Other Attachments</h6>
              <p>Please include any relevant files here</p>
              {this.renderAttachments()}
              <S3FileUploader
                name={`attachment-${this.state.attachments.length}`}
                className="btn btn-iku btn-round btn-file"
                onUploadSuccess={url => this.onAttachmentUploaded(url)}
                onUploadError={msg => this.onAttachmentUploadError(msg)}
              >
                <span className="fileinput-new">
                  <i className="fa fa-plus" /> Add a file
                </span>
              </S3FileUploader>
            </div>
          </div>

          <div className="form-check compliance">
            <label htmlFor="certify" className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                name="certify"
                id="certify"
                checked={this.state.certify ? 'checked' : ''}
                onChange={e => this.setValue(e)}
                value="true"
              />
              <span className="form-check-sign" />
              I certify that the information I have given on the proposal is
              complete and correct
            </label>
          </div>
          {!this.props.loading ? this.renderButton() : <Loader />}
        </div>
      </div>
    );
  }

  renderButton() {
    return (
      <div className="ml-auto mr-auto text-center title">
        <button
          type="button"
          className="btn btn-iku btn-big submit"
          onClick={this.submitProposal}
        >
          Submit Proposal
        </button>
      </div>
    );
  }

  renderNewProposal() {
    return (
      <div className="container col-md-8">
        <Title align="center">
          {this.isEditing() ? 'Edit' : 'Submit'} Proposal
        </Title>
        <div className="form-wrapper">
          <div className="row ml-auto mr-auto text-center title">
            <p className="form-help">
              Your Proposal has been{' '}
              {this.isEditing() ? 'updated' : 'submitted'} succesfully.
              <br />
            </p>
            <div className="title">
              <Link
                className="btn btn-iku btn-faucet"
                to={{
                  pathname: `/proposal/${this.props.newProposal.id}`,
                }}
              >
                View Proposal
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContent = () => (
    <div className="submit-proposal-page">
      <div className="section section-grey">
        {this.props.newProposal ? this.renderNewProposal() : this.renderForm()}
      </div>
    </div>
  );

  render() {
    return (
      <div className="wrapper">
        {this.props.loggedIn ? this.renderContent() : <Error401 />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.proposals.submittingProposal,
    error: state.proposals.submissionError,
    newProposal: state.proposals.submission,
    proposals: state.proposals.proposals,
  }),
  dispatch => ({
    submitProposal: (fields, address) =>
      dispatch(submitProposalAction(fields, address)),
    clearSubmissionData: () => dispatch(clearSubmissionDataAction()),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(SubmitProposal);
