import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';
import Token from '../../utils/Token';

const ACTIONS = {
  GET_PROPOSALS: 'PROPOSALS/GET_PROPOSALS',
  GET_PROPOSALS_SUCCESS: 'PROPOSALS/GET_PROPOSALS_SUCCESS',
  GET_PROPOSALS_FAILURE: 'PROPOSALS/GET_PROPOSALS_FAILURE',
  SET_PROPOSALS: 'PROPOSALS/SET_PROPOSALS',
  SEARCH_PROPOSALS: 'PROPOSALS/SEARCH_PROPOSALS',
  SEARCH_PROPOSALS_SUCCESS: 'PROPOSALS/SEARCH_PROPOSALS_SUCCESS',
  SUBMIT_PROPOSAL: 'PROPOSALS/SUBMIT_PROPOSAL',
  SUBMIT_PROPOSAL_SUCCESS: 'PROPOSALS/SUBMIT_PROPOSAL_SUCCESS',
  SUBMIT_PROPOSAL_FAILURE: 'PROPOSALS/SUBMIT_PROPOSAL_FAILURE',
  CLEAR_SUBMISSION_DATA: 'PROPOSALS/CLEAR_SUBMISSION_DATA',
  GET_COMMENTS: 'PROPOSALS/GET_COMMENTS',
  GET_COMMENTS_SUCCESS: 'PROPOSALS/GET_COMMENTS_SUCCESS',
  GET_COMMENTS_FAILURE: 'PROPOSALS/GET_COMMENTS_FAILURE',
  COMMENT: 'PROPOSALS/COMMENT',
  COMMENT_SUCCESS: 'PROPOSALS/COMMENT_SUCCESS',
  COMMENT_FAILURE: 'PROPOSALS/COMMENT_FAILURE',
};

function getProposalsAction() {
  return {
    type: ACTIONS.GET_PROPOSALS,
  };
}

function getProposalsRequest() {
  return apiRequest('/api/proposal', {});
}

function getProposalsSuccess(proposals) {
  return {
    type: ACTIONS.GET_PROPOSALS_SUCCESS,
    proposals,
  };
}

function getProposalsFailure(error) {
  return {
    type: ACTIONS.GET_PROPOSALS_FAILURE,
    error,
  };
}

function searchProposalsAction(query) {
  return {
    type: ACTIONS.SEARCH_PROPOSALS,
    query,
  };
}

function searchProposalsRequest(query) {
  return apiRequest('/api/proposal', { query });
}

function searchProposalsSuccess(searchResults) {
  return {
    type: ACTIONS.SEARCH_PROPOSALS_SUCCESS,
    searchResults,
  };
}

function submitProposalAction(fields, address) {
  return {
    type: ACTIONS.SUBMIT_PROPOSAL,
    fields,
    address,
  };
}

function submitProposalRequest(fields, address) {
  return apiRequest('/api/proposal', {
    method: 'post',
    body: { ...fields },
    jwt_auth: Token.get(address),
  });
}

function submitProposalSuccess(submission) {
  return {
    type: ACTIONS.SUBMIT_PROPOSAL_SUCCESS,
    submission,
  };
}

function submitProposalFailure({ error }) {
  return {
    type: ACTIONS.SUBMIT_PROPOSAL_FAILURE,
    error,
  };
}

function clearSubmissionDataAction() {
  return {
    type: ACTIONS.CLEAR_SUBMISSION_DATA,
  };
}

function getCommentsAction(id) {
  return {
    type: ACTIONS.GET_COMMENTS,
    id,
  };
}

function getCommentsRequest(id) {
  return apiRequest(
    '/api/proposal/comment',
    {
      method: 'get',
    },
    { id }
  );
}

function getCommentsSuccess(response) {
  const { comments } = response;
  return {
    type: ACTIONS.GET_COMMENTS_SUCCESS,
    comments,
  };
}

function getCommentsFailure(error) {
  return {
    type: ACTIONS.GET_COMMENTS_FAILURE,
    error,
  };
}

function commentAction(body, address) {
  return {
    type: ACTIONS.COMMENT,
    body,
    address,
  };
}

function commentRequest(body, address) {
  return apiRequest('/api/proposal/comment', {
    method: 'post',
    body,
    jwt_auth: Token.get(address),
  });
}

function commentSuccess(response) {
  const { comments } = response;
  return {
    type: ACTIONS.COMMENT_SUCCESS,
    comments,
  };
}

function commentFailure({ error }) {
  return {
    type: ACTIONS.COMMENT_FAILURE,
    error,
  };
}

const initialState = {
  error: null,
  loading: false,
  targets: null,
  searching: false,
  proposals: [],
  searchResults: [],
  submissionError: null,
  submission: null,
  submittingProposal: false,
  comments: [],
  fetchingComments: false,
  commenting: false,
  commented: false,
  commentingError: null,
  fetchCommentsError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_PROPOSALS:
      return loop(
        { ...state, loading: true },
        Cmd.run(getProposalsRequest, {
          successActionCreator: getProposalsSuccess,
          failActionCreator: getProposalsFailure,
        })
      );

    case ACTIONS.GET_PROPOSALS_SUCCESS:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ACTIONS.SET_PROPOSALS,
          proposals: action.proposals,
        })
      );

    case ACTIONS.GET_PROPOSALS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case ACTIONS.SET_PROPOSALS:
      return { ...state, proposals: action.proposals };

    case ACTIONS.SEARCH_PROPOSALS:
      return loop(
        { ...state, searching: true },
        Cmd.run(searchProposalsRequest, {
          successActionCreator: searchProposalsSuccess,
          // beware: using generic error handler
          failActionCreator: getProposalsFailure,
        })
      );

    case ACTIONS.SEARCH_PROPOSALS_SUCCESS:
      return loop(
        { ...state, searching: false },
        Cmd.action({
          type: ACTIONS.SET_SEARCH_RESULTS,
          searchResults: action.searchResults,
        })
      );

    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.searchResults };

    case ACTIONS.SUBMIT_PROPOSAL:
      return loop(
        { ...state, submittingProposal: true },
        Cmd.run(submitProposalRequest, {
          successActionCreator: submitProposalSuccess,
          failActionCreator: submitProposalFailure,
          args: [action.fields, action.address],
        })
      );

    case ACTIONS.SUBMIT_PROPOSAL_SUCCESS:
      return {
        ...state,
        submission: action.submission,
        submittingProposal: false,
      };

    case ACTIONS.SUBMIT_PROPOSAL_FAILURE:
      return {
        ...state,
        submissionError:
          'An error occurred submitting your proposal. Please try again.',
        submittingProposal: false,
      };

    case ACTIONS.CLEAR_SUBMISSION_DATA:
      return { ...state, submission: null, submissionError: null };

    case ACTIONS.GET_COMMENTS:
      return loop(
        { ...state, fetchingComments: action.id },
        Cmd.run(getCommentsRequest, {
          successActionCreator: getCommentsSuccess,
          failActionCreator: getCommentsFailure,
          args: [action.id],
        })
      );

    case ACTIONS.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: action.comments,
        fetchingComments: false,
      };

    case ACTIONS.GET_COMMENTS_FAILURE:
      return {
        ...state,
        fetchCommentsError:
          action.error || 'An error occurred getting comments.',
        fetchingComments: false,
      };

    case ACTIONS.COMMENT:
      return loop(
        { ...state, commenting: action.id, commented: false },
        Cmd.run(commentRequest, {
          successActionCreator: commentSuccess,
          failActionCreator: commentFailure,
          args: [action.body, action.address],
        })
      );

    case ACTIONS.COMMENT_SUCCESS:
      return {
        ...state,
        comments: action.comments,
        commenting: false,
        commented: true,
      };

    case ACTIONS.COMMENT_FAILURE:
      return {
        ...state,
        commentingError:
          action.error ||
          'An error occurred while adding a comment. Please try again.',
        commenting: false,
        commented: false,
      };

    default:
      return state;
  }
}

export {
  getProposalsAction,
  searchProposalsAction,
  submitProposalAction,
  clearSubmissionDataAction,
  getCommentsAction,
  commentAction,
};
