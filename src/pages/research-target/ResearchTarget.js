import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DisqusComments from '../../components/DisqusComments';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import Tags from '../../components/Tags';
import './ResearchTarget.css';

import {
  getVotesAction,
  voteAction,
} from '../../redux/modules/researchTargets';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

class ResearchTarget extends Component {
  constructor(props) {
    super(props);
    this.currentUrl = this.getCurrentUrl();
    this.voteCount = 0;
  }

  componentDidMount() {
    this.fetchVotes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.votingError) {
      alert(nextProps.votingError);
    }
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  getCurrentUrl() {
    return `${window.location.protocol}//${window.location.host}${
      this.props.location.pathname
    }${window.location.search}`;
  }

  getTargetId() {
    return this.props.location.pathname.replace('/research-target/', '');
  }

  getTargetInfo() {
    const id = this.getTargetId();
    return (
      this.props.researchTargets &&
      this.props.researchTargets.find(t => t.id === parseInt(id, 10))
    );
  }

  getVoteCount() {
    if (this.props.votes) {
      const currentTarget = this.props.votes[this.getTargetId()];
      const newCount = (currentTarget || {}).votes || 0;
      if (newCount > this.voteCount) {
        this.voteCount = newCount;
      }
      return this.voteCount;
    } else {
      return 0;
    }
  }

  getVoted() {
    const currentTarget = this.props.votes[this.getTargetId()];
    return (currentTarget || {}).voted;
  }

  fetchVotes() {
    this.props.getVotes(this.getTargetId());
  }

  vote() {
    if (this.getVoted()) {
      this.props.setAlert('You already voted!');
      return false;
    }
    this.props.vote(this.getTargetInfo(), this.getTargetId());
  }

  share(platform) {
    let url;
    const info = this.getTargetInfo();

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer.php?u=${this.currentUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/share?url=${
        this.currentUrl
      }&amp;text=Learn more about ${info.name} at iku.network`;
    }

    window.open(url, '', 'width=500,height=400,resizable=yes').focus();
  }

  formatDate = () => {
    const info = this.getTargetInfo();
    const d = info.created_at;
    const date = new Date(d);
    const options = {};
    return date.toLocaleDateString('en-US', options);
  };

  renderVideo = info => {
    if (!info.video || info.video.trim() === '') {
      return null;
    }
    // eslint-disable-next-line
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = info.video.match(regExp);
    if (match && match[2].length === 11) {
      return (
        <iframe
          width="100%"
          height="100%"
          src={`//www.youtube.com/embed/${match[2]}`}
          frameBorder="0"
          allowFullScreen=""
          title="youtube"
        />
      );
    }
  };

  renderVideoOrImage(info) {
    const video = this.renderVideo(info);
    if (video) {
      return video;
    }

    const img = info.picture
      ? info.picture
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port !== 80 ? `:${window.location.port}` : ''
        }/assets/img/not-available.jpg`;

    return (
      <div
        style={{
          backgroundImage: `url('${img}')`,
        }}
        className="proposal-image"
      />
    );
  }

  renderResearch = info => [
    <p key="est_required">
      <b>Est. $ Required:</b> {info.est_required || 'Unknown'}
    </p>,
    <p key="status">
      <b>Status:</b> {info.current_status || 'Unknown'}
    </p>,
  ];

  renderBiomarket = info => {
    const items = [];
    if (info.disease_type && info.disease_type !== '') {
      items.push(
        <p key="disease_type">
          <b>Type of disease:</b> {info.disease_type}
        </p>
      );
    }

    if (info.rare_disease && info.rare_disease) {
      items.push(
        <p key="rare_disease">
          <b>Rare disease:</b> {info.rare_disease ? 'YES' : 'NO'}
        </p>
      );
    }

    if (info.affected_people && info.affected_people !== '') {
      items.push(
        <p key="affected_people">
          <b>Number of affected people:</b> {info.affected_people}
        </p>
      );
    }

    if (info.biomarker && info.biomarker !== '') {
      items.push(
        <p key="biomarker">
          <b>Biomarker:</b> {info.biomarker}
        </p>
      );
    }

    if (info.molecule && info.molecule !== '') {
      items.push(
        <p key="molecule">
          <b>Molecule:</b> {info.molecule}
        </p>
      );
    }

    const title = (
      <div key="biomarker-title" className="form-section-header">
        <h4>Biomarket</h4>
      </div>
    );
    if (items.length > 0) {
      items.push(<br key="separator-1" />);
      return [title, ...items];
    }
    return null;
  };

  renderConclusion = info => {
    if (info.conclusion) {
      return (
        <div>
          <br />
          <h6>References: </h6>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: info.conclusion }}
          />
          <hr />
        </div>
      );
    }
    return null;
  };

  renderEditOrCreator(info) {
    if (
      info.created_by &&
      this.props.user.id &&
      this.props.user.id === info.created_by
    ) {
      return (
        <div className="row">
          <div className="col-md-12 ml-auto mr-auto text-center ">
            <Link
              to={{
                pathname: `/edit-research-target/${info.id}`,
                state: info,
              }}
              className="btn btn-round"
            >
              <i className="fa fa-pencil" /> Edit
            </Link>
          </div>
        </div>
      );
    }

    if (info.author) {
      return (
        <div className="row">
          <div className="col-md-12 ml-auto mr-auto text-center ">
            <h3 className="title-uppercase">
              <small>submitted by {info.author}</small>
            </h3>
            <h6 className="title-uppercase">{this.formatDate()}</h6>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-12 ml-auto mr-auto text-center ">
            <h6 className="title-uppercase">CREATED ON {this.formatDate()}</h6>
          </div>
        </div>
      );
    }
  }

  renderBody() {
    const info = this.getTargetInfo();
    return (
      <div className="wrapper research-target">
        <div className="section section-white">
          <div className="container">
            <Title align="center">{info.name}</Title>
            <div className="row">
              <div className="col-md-10 ml-auto mr-auto">
                <div className="card" data-radius="none">
                  {this.renderVideoOrImage(info)}
                </div>
                {this.renderEditOrCreator(info)}
                <div className="rt-main-content">
                  <div className="row social-row">
                    <div className="col-md-6">
                      <h5>Votes:</h5>
                      <div className="vote-wrapper">
                        <button
                          className="btn btn-just-icon btn-reddit like-cnt unchecked"
                          onClick={_ => this.vote()}
                        >
                          <i className="fa fa-thumbs-up" />
                        </button>
                        <span className="vote-count">
                          {this.getVoteCount()}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-3 ml-auto">
                      <div className="sharing">
                        <h5>Spread the word</h5>
                        <button
                          className="btn btn-just-icon btn-share btn-twitter"
                          onClick={_ => this.share('twitter')}
                        >
                          <i className="fa fa-twitter" />
                        </button>
                        <button
                          className="btn btn-just-icon btn-share btn-facebook"
                          onClick={_ => this.share('facebook')}
                        >
                          <i className="fa fa-facebook" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div className="row">
                    <Tags
                      tags={
                        info.tags && info.tags !== ''
                          ? info.tags.split(',')
                          : []
                      }
                      disabled={true}
                      placeholder=""
                      readOnly={true}
                    />
                  </div>
                  <div key="research-title" className="form-section-header">
                    <h4>Research</h4>
                  </div>
                  <div className="article-content">
                    {this.renderResearch(info)}
                  </div>
                  <div className="article-content">
                    {this.renderBiomarket(info)}
                  </div>
                  <div key="biomarker-title" className="form-section-header">
                    <h4>Science / Hypothesis</h4>
                  </div>
                  <div
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: info.description }}
                  />

                  {this.renderConclusion(info)}
                  <br />

                  <div className="article-footer">
                    <DisqusComments
                      id={info.id}
                      title={info.name}
                      currentUrl={this.currentUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.getTargetInfo() ? this.renderBody() : <Loader />;
  }
}

export default connect(
  state => ({
    researchTargets: state.researchTargets.targets,
    votes: state.researchTargets.votes,
    votingError: state.researchTargets.votingError,
    user: state.user,
  }),
  dispatch => ({
    getVotes: id => dispatch(getVotesAction(id)),
    vote: body => dispatch(voteAction(body)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(ResearchTarget);
