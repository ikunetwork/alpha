import React, { Component } from 'react';
import { connect } from 'react-redux';

import IkuTokenHelper from '../utils/IkuTokenHelper';
import Loader from './Loader';
import Blocky from './Blocky';
import { getCommentsAction, commentAction } from '../redux/modules/proposals';

class ProposalComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userTokenBalance: 0,
      replyToComment: null,
      newReplyText: '',
      newCommentText: '',
    };

    if (props.web3 && props.user) {
      this.getBalance(props.web3, props.user.address);
    }
  }

  componentDidMount() {
    this.fetchComments();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3 && nextProps.user) {
      this.getBalance(nextProps.web3, nextProps.user.address);
    }

    if (nextProps.commented && !this.props.commented) {
      this.resetUI();
    }
  }

  getBalance(web3, address) {
    IkuTokenHelper.getBalance(web3.currentProvider, address).then(balance => {
      this.setState({ userTokenBalance: balance });
    });
  }

  setValue(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  }

  resetUI() {
    this.setState({
      newReplyText: '',
      newCommentText: '',
      replyToComment: null,
    });
  }

  fetchComments() {
    this.props.getComments(this.props.proposalId);
  }

  canComment() {
    return (
      this.state.userTokenBalance &&
      this.state.userTokenBalance.gt(0) &&
      this.props.user &&
      this.props.user.id
    );
  }

  formatDate = d => {
    const _ = new Date(d);
    const options = {};

    const date = _.toLocaleDateString('en-US', options);
    const time = _.toLocaleTimeString('en-US', options);
    return `on ${date} ${time}`;
  };

  submitReplyToComment = (e, id) => {
    e.preventDefault();
    this.addComment(this.state.newReplyText, id);
  };

  submitNewComment = e => {
    e.preventDefault();
    this.addComment(this.state.newCommentText, null);
  };

  addComment(text, parent_id) {
    const data = {
      proposal_id: this.props.proposalId,
      comment: text,
      parent_id,
    };

    this.props.comment(data, this.props.user.address);
  }

  showReply(e, id) {
    this.setState({ replyToComment: id });
  }

  renderReply(id) {
    if (this.state.replyToComment === id) {
      return (
        <div className="reply-wrapper">
          <div className="row">
            <div className="col-md-12 col-sm-6">
              <textarea
                className="form-control border-input"
                placeholder="Your reply goes here..."
                rows="5"
                value={this.state.newReplyText}
                name="newReplyText"
                onChange={e => this.setValue(e)}
              />
            </div>
          </div>
          <div className="ml-auto mr-auto text-center title">
            <button
              type="button"
              className="btn btn-iku"
              onClick={e => this.submitReplyToComment(e, id)}
            >
              Add Comment
            </button>
          </div>
        </div>
      );
    }
  }

  renderAddNewComment = () => (
    <div>
      <div className="row">
        <h4 className="title">Add a new comment:</h4>
        <hr />
      </div>
      <div className="row">
        <div className="col-md-12 col-sm-6">
          <textarea
            className="form-control border-input"
            placeholder="Your comment goes here..."
            rows="5"
            value={this.state.newCommentText}
            name="newCommentText"
            onChange={e => this.setValue(e)}
          />
        </div>
      </div>
      <div className="ml-auto mr-auto text-center title">
        <button
          type="button"
          className="btn btn-iku"
          onClick={e => this.submitNewComment(e)}
        >
          Add Comment
        </button>
      </div>
    </div>
  );

  renderSingleComment(comment, canComment) {
    return (
      <div className="media" key={comment.id}>
        <a className="pull-left" href="#paper-kit">
          <Blocky
            random={true}
            address={comment.user.address}
            size="big"
            className="media-object avatar"
          />
        </a>
        <div className="media-body">
          <h5 className="media-heading">{comment.user.name}</h5>
          <div className="pull-right">
            <h6 className="text-muted">
              {this.formatDate(comment.created_at)}
            </h6>
            {canComment ? (
              <button
                className="btn btn-iku btn-link pull-right"
                onClick={e => this.showReply(e, comment.id)}
              >
                {' '}
                <i className="fa fa-reply" /> Reply
              </button>
            ) : null}
          </div>
          <p>{comment.comment}</p>

          {this.renderReply(comment.id)}

          {comment.replies &&
            comment.replies.map((reply, i) =>
              this.renderSingleComment(reply, canComment)
            )}
        </div>
      </div>
    );
  }

  renderLoader = () => (
    <div className="comments media-area">
      <Loader size="small" />
    </div>
  );

  renderComments(canComment) {
    if (this.props.comments.length) {
      return this.props.comments.map((comment, i) =>
        this.renderSingleComment(comment, canComment)
      );
    }
    return <p>There are no comments yet...</p>;
  }

  render() {
    if (this.props.commenting || this.props.fetchingComments) {
      return this.renderLoader();
    }

    const canComment = this.canComment();

    return (
      <div className="comments media-area">
        {this.renderComments(canComment)}
        {canComment ? this.renderAddNewComment() : null}
      </div>
    );
  }
}

export default connect(
  state => ({
    comments: state.proposals.comments,
    fetchingComments: state.proposals.fetchingComments,
    commenting: state.proposals.commenting,
    commented: state.proposals.commented,
  }),
  dispatch => ({
    getComments: id => dispatch(getCommentsAction(id)),
    comment: (body, address) => dispatch(commentAction(body, address)),
  })
)(ProposalComments);
