import React, { Component } from 'react';
import { connect } from 'react-redux';
import Recaptcha from 'react-recaptcha';
import { Link } from 'react-router-dom';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import Loader from '../../components/Loader';
import Title from '../../components/Title';
import Tags from '../../components/Tags';
import Config from '../../utils/Config';

import {
  submitResearchTargetAction,
  clearSubmissionDataAction,
} from '../../redux/modules/researchTargets';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

import './SubmitResearchTarget.css';

class SubmitResearchTarget extends Component {
  constructor(props) {
    super(props);

    let initialState = {
      name: '',
      picture: '',
      video: '',
      description: '',
      author: '',
      captcha_token: '',
      is_valid_captcha: false,
      tags: [],
      intro: '',
      conclusion: '',
      rare_disease: false,
      disease_type: '',
      affected_people: '',
      biomarker: '',
      molecule: '',
      current_status: '',
      est_required: '',
    };
    if (props.location && props.location.state) {
      let tags = [];
      if (props.location.state.tags.trim() !== '') {
        tags = props.location.state.tags.trim().split(',');
      }
      initialState = {
        ...initialState,
        ...props.location.state,
        tags,
      };
    }

    this.state = initialState;
  }

  componentDidMount() {
    this.props.clearSubmissionData();
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  onTagAdded = t => {
    const tags = [...this.state.tags, ...t].filter(
      (elem, pos, arr) => arr.indexOf(elem) === pos
    );
    this.setState({ tags });
  };

  onTagRemoved = value => {
    const tags = this.state.tags.filter(tag => tag !== value);
    this.setState({ tags });
  };

  setValue(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  setAlert(msg) {
    this.props.setAlert(msg);
    window.scrollTo(0, 0);
  }

  verifyCaptcha(r) {
    this.setState({ is_valid_captcha: true, captcha_token: r });
  }

  submitResearchTarget() {
    const {
      name,
      picture,
      video,
      description,
      author,
      captcha_token,
      intro,
      conclusion,
      rare_disease,
      disease_type,
      affected_people,
      biomarker,
      molecule,
      current_status,
      est_required,
    } = this.state;

    if (name.trim() === '') {
      this.props.setAlert('You need to enter the name of the Research Target');
      return false;
    }

    if (description.trim() === '') {
      this.props.setAlert('The Science / Hypothesis section is required');
      return false;
    }

    if (
      video.trim() !== '' &&
      video.search('youtube.com') === -1 &&
      video.search('youtu.be') === -1
    ) {
      this.props.setAlert('Only youtube urls are supported at this moment');
      return false;
    }

    const data = {
      name,
      picture,
      video,
      description,
      author,
      captcha_token,
      intro,
      conclusion,
      rare_disease,
      disease_type,
      affected_people,
      biomarker,
      molecule,
      current_status,
      est_required,
      tags: this.state.tags.join(','),
    };

    // Pass the user if logged in
    if (this.props.user && this.props.user.id) {
      data.created_by = this.props.user.id;
    }

    if (this.state.id) {
      data.id = this.state.id;
    }

    this.props.submitResearchTarget(data);
  }

  handleEditorChange = (text, medium, name) => {
    this.setState({
      [name]: text,
    });
  };

  renderError = () => (
    <div className="form-error">
      <p>
        There was an error while trying to submit your research target.<br />
        Please try again...
        <br />
      </p>
    </div>
  );

  renderForm() {
    return (
      <div className="container col-md-12">
        <Title align="center">
          {this.state.id ? 'Edit' : 'Submit'} Research Target
        </Title>
        <div className="form-wrapper">
          <div className="row">
            <p className="form-help">
              The main goal of this is to educate, help raise awareness and get
              the scientific community's attention about Research Targets that
              can be potential candidates for their future investigations.
            </p>
            {this.props.error ? this.renderError() : null}
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <h6>
                  Name <span className="icon-danger">*</span>
                </h6>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={this.state.name}
                  placeholder="Make sure you mention Disease + technology"
                  onChange={e => this.setValue(e)}
                  maxLength="50"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Picture URL</h6>
                <input
                  type="text"
                  className="form-control"
                  name="picture"
                  value={this.state.picture}
                  placeholder="For ex. http://domain.com/image.png"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Video URL</h6>
                <input
                  type="text"
                  className="form-control"
                  name="video"
                  value={this.state.video}
                  placeholder="For ex. https://www.youtube.com/watch?v=j23HnORQXvs"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <h6>Author</h6>
                <input
                  type="text"
                  className="form-control"
                  name="author"
                  value={this.state.author}
                  placeholder="For ex. John Doe"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h6>
                Tags / Keywords <span className="icon-danger">*</span>
              </h6>
              <Tags
                tags={this.state.tags}
                disabled={false}
                placeholder="Separate tags with a comma"
                onAdded={this.onTagAdded}
                onRemoved={this.onTagRemoved}
                readOnly={false}
              />
            </div>
          </div>
          <div className="form-section-header">
            <h4>Biomarket</h4>
          </div>

          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Number of affected people</h6>
                <input
                  type="text"
                  className="form-control"
                  name="affected_people"
                  value={this.state.affected_people}
                  placeholder="For ex. ~10M"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
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
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Current Status</h6>
                <input
                  type="text"
                  className="form-control"
                  name="current_status"
                  value={this.state.current_status}
                  placeholder="For ex. exploratory, lab, humans, etc."
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Est. $ required:</h6>
                <select
                  className="form-control"
                  name="est_required"
                  value={this.state.est_required}
                  onChange={e => this.setValue(e)}
                >
                  <option>Unknown</option>
                  <option> {'<'} $1 million</option>
                  <option> {'<'} $10 million</option>
                  <option> {'<'} $25 million</option>
                  <option> {'<'} $100 million</option>
                  <option> {'>'} $100 million</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Biomarker</h6>
                <input
                  type="text"
                  className="form-control"
                  name="biomarker"
                  value={this.state.biomarker}
                  placeholder="Biomarker"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <h6>Molecule</h6>
                <input
                  type="text"
                  className="form-control"
                  name="molecule"
                  value={this.state.molecule}
                  placeholder="molecule"
                  onChange={e => this.setValue(e)}
                />
              </div>
            </div>
          </div>
          <div className="form-section-header">
            <h4>Science / Hypothesis</h4>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <div className="form-control science">
                  <Editor
                    text={this.state.description}
                    onChange={(text, medium) =>
                      this.handleEditorChange(text, medium, 'description')
                    }
                    options={{
                      placeholder: {
                        text: 'Should be ~250 words...',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="form-group">
                <h6>References</h6>
                <div className="form-control intro">
                  <Editor
                    text={this.state.conclusion}
                    onChange={(text, medium) =>
                      this.handleEditorChange(text, medium, 'conclusion')
                    }
                    options={{
                      placeholder: {
                        text:
                          'Any references you need to cite should go here...',
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="recaptcha-container">
            <Recaptcha
              sitekey={Config.GOOGLE_RECAPTCHA_KEY}
              verifyCallback={r => this.verifyCaptcha(r)}
              render="explicit"
            />
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
          className="btn btn-iku btn-big"
          onClick={_ => this.submitResearchTarget()}
          disabled={!this.state.is_valid_captcha}
        >
          Submit Research Target
        </button>
      </div>
    );
  }

  renderNewRT() {
    return (
      <div className="container col-md-12">
        <Title align="center">
          Research Target {this.state.id ? 'Updated' : 'Submitted'}
        </Title>
        <div className="form-wrapper">
          <div className="row ml-auto mr-auto text-center title">
            <p className="form-help">
              Your Research Target has been{' '}
              {this.state.id ? 'updated' : 'submitted'} succesfully.
              <br />
            </p>
            <div className="title">
              <Link
                className="btn btn-iku btn-faucet"
                to={{
                  pathname: `/research-target/${this.props.submission.id}`,
                  state: this.props.submission,
                }}
              >
                View Research Target
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
        <div className="submit-rt-page">
          <div className="section section-grey">
            {this.props.submission ? this.renderNewRT() : this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    submission: state.researchTargets.submission,
    loading: state.researchTargets.submittingResearchTarget,
    error: state.researchTargets.submissionError,
  }),
  dispatch => ({
    submitResearchTarget: fields =>
      dispatch(submitResearchTargetAction(fields)),
    clearSubmissionData: () => dispatch(clearSubmissionDataAction()),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(SubmitResearchTarget);
