import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';

const ACTIONS = {
  GET_RESEARCH_TARGETS: 'RESEARCH_TARGETS/GET_RESEARCH_TARGETS',
  GET_RESEARCH_TARGETS_SUCCESS: 'RESEARCH_TARGETS/GET_RESEARCH_TARGETS_SUCCESS',
  GET_RESEARCH_TARGETS_FAILURE: 'RESEARCH_TARGETS/GET_RESEARCH_TARGETS_FAILURE',
  SET_RESEARCH_TARGETS: 'RESEARCH_TARGETS/SET_RESEARCH_TARGETS',
  SEARCH_RESEARCH_TARGETS: 'RESEARCH_TARGETS/SEARCH_RESEARCH_TARGETS',
  SEARCH_RESEARCH_TARGETS_SUCCESS:
    'RESEARCH_TARGETS/SEARCH_RESEARCH_TARGETS_SUCCESS',
  SUBMIT_RESEARCH_TARGET: 'RESEARCH_TARGETS/SUBMIT_RESEARCH_TARGET',
  SUBMIT_RESEARCH_TARGET_SUCCESS:
    'RESEARCH_TARGETS/SUBMIT_RESEARCH_TARGET_SUCCESS',
  SUBMIT_RESEARCH_TARGET_FAILURE:
    'RESEARCH_TARGETS/SUBMIT_RESEARCH_TARGET_FAILURE',
  CLEAR_SUBMISSION_DATA: 'RESEARCH_TARGETS/CLEAR_SUBMISSION_DATA',
  GET_VOTES: 'RESEARCH_TARGETS/GET_VOTES',
  GET_VOTES_SUCCESS: 'RESEARCH_TARGETS/GET_VOTES_SUCCESS',
  GET_VOTES_FAILURE: 'RESEARCH_TARGETS/GET_VOTES_FAILURE',
  VOTE: 'RESEARCH_TARGETS/VOTE',
  VOTE_SUCCESS: 'RESEARCH_TARGETS/VOTE_SUCCESS',
  VOTE_FAILURE: 'RESEARCH_TARGETS/VOTE_FAILURE',
};

function getResearchTargetsAction() {
  return {
    type: ACTIONS.GET_RESEARCH_TARGETS,
  };
}

function getResearchTargetsRequest() {
  return apiRequest('/api/research-target', {});
}

function getResearchTargetsSuccess(researchTargets) {
  return {
    type: ACTIONS.GET_RESEARCH_TARGETS_SUCCESS,
    researchTargets,
  };
}

function getResearchTargetsFailure(error) {
  return {
    type: ACTIONS.GET_RESEARCH_TARGETS_FAILURE,
    error,
  };
}

function searchResearchTargetsAction(query) {
  return {
    type: ACTIONS.SEARCH_RESEARCH_TARGETS,
    query,
  };
}

function searchResearchTargetsRequest(query) {
  const lcQuery = query.toLowerCase();
  const filterByFormula = `OR(
    			FIND("${lcQuery.toLowerCase()}",LOWER(Name)) > 0, 
    			FIND("${lcQuery.toLowerCase()}",LOWER(Description)) > 0
        )`;
  return apiRequest('/api/research-target', {
    filterByFormula,
  });
}

function searchResearchTargetsSuccess(searchResults) {
  return {
    type: ACTIONS.SEARCH_RESEARCH_TARGETS_SUCCESS,
    searchResults,
  };
}

function submitResearchTargetAction(fields) {
  return {
    type: ACTIONS.SUBMIT_RESEARCH_TARGET,
    fields,
  };
}

function submitResearchTargetRequest(fields) {
  const method = fields.id ? 'put' : 'post';

  return apiRequest('/api/research-target', {
    method,
    body: { ...fields },
  });
}

function submitResearchTargetSuccess(submission) {
  return {
    type: ACTIONS.SUBMIT_RESEARCH_TARGET_SUCCESS,
    submission,
  };
}

function submitResearchTargetFailure({ error }) {
  return {
    type: ACTIONS.SUBMIT_RESEARCH_TARGET_FAILURE,
    error,
  };
}

function clearSubmissionDataAction() {
  return {
    type: ACTIONS.CLEAR_SUBMISSION_DATA,
  };
}

function getVotesAction(id) {
  return {
    type: ACTIONS.GET_VOTES,
    id,
  };
}

function getVotesRequest(id) {
  return apiRequest(
    '/api/research-target/vote',
    {
      method: 'get',
    },
    { id }
  );
}

function getVotesSuccess(response) {
  const { votes } = response;
  return {
    type: ACTIONS.GET_VOTES_SUCCESS,
    votes,
  };
}

function getVotesFailure(error) {
  return {
    type: ACTIONS.GET_VOTES_FAILURE,
    error,
  };
}

function voteAction(body, id) {
  return {
    type: ACTIONS.VOTE,
    body,
    id,
  };
}

function voteRequest(body) {
  return apiRequest('/api/research-target/vote', {
    method: 'post',
    body,
  });
}

function voteSuccess() {
  return {
    type: ACTIONS.VOTE_SUCCESS,
  };
}

function voteFailure({ error }) {
  return {
    type: ACTIONS.VOTE_FAILURE,
    error,
  };
}

const initialState = {
  error: null,
  loading: false,
  targets: null,
  searching: false,
  researchTargets: [],
  searchResults: [],
  submittingResearchTarget: false,
  submissionError: null,
  submission: null,
  voting: false,
  votingError: null,
  fetchVotesError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_RESEARCH_TARGETS:
      return loop(
        { ...state, loading: true },
        Cmd.run(getResearchTargetsRequest, {
          successActionCreator: getResearchTargetsSuccess,
          failActionCreator: getResearchTargetsFailure,
        })
      );

    case ACTIONS.GET_RESEARCH_TARGETS_SUCCESS:
      return loop(
        {
          ...state,
          loading: false,
          targets: action.researchTargets,
        },
        Cmd.action({
          type: ACTIONS.SET_RESEARCH_TARGETS,
          researchTargets: action.researchTargets,
        })
      );

    case ACTIONS.GET_RESEARCH_TARGETS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case ACTIONS.SET_RESEARCH_TARGETS:
      return { ...state, researchTargets: action.researchTargets };

    case ACTIONS.SEARCH_RESEARCH_TARGETS:
      return loop(
        { ...state, searching: true },
        Cmd.run(searchResearchTargetsRequest, {
          successActionCreator: searchResearchTargetsSuccess,
          // beware: using generic error handler
          failActionCreator: getResearchTargetsFailure,
        })
      );

    case ACTIONS.SEARCH_RESEARCH_TARGETS_SUCCESS:
      return loop(
        { ...state, searching: false },
        Cmd.action({
          type: ACTIONS.SET_SEARCH_RESULTS,
          searchResults: action.searchResults,
        })
      );

    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.searchResults };

    case ACTIONS.SUBMIT_RESEARCH_TARGET:
      return loop(
        { ...state, submittingResearchTarget: true },
        Cmd.run(submitResearchTargetRequest, {
          successActionCreator: submitResearchTargetSuccess,
          failActionCreator: submitResearchTargetFailure,
          args: [action.fields],
        })
      );

    case ACTIONS.SUBMIT_RESEARCH_TARGET_SUCCESS:
      return {
        ...state,
        submission: action.submission,
        submittingResearchTarget: false,
      };

    case ACTIONS.SUBMIT_RESEARCH_TARGET_FAILURE:
      return {
        ...state,
        submissionError:
          action.error ||
          'An error occurred submitting the research target. Please try again.',
        submittingResearchTarget: false,
      };

    case ACTIONS.CLEAR_SUBMISSION_DATA:
      return { ...state, submission: null, submissionError: null };

    case ACTIONS.GET_VOTES:
      return loop(
        { ...state, fetchingVotes: action.id },
        Cmd.run(getVotesRequest, {
          successActionCreator: getVotesSuccess,
          failActionCreator: getVotesFailure,
          args: [action.id],
        })
      );

    case ACTIONS.GET_VOTES_SUCCESS:
      return {
        ...state,
        votes: {
          ...state.votes,
          [state.fetchingVotes]: {
            votes: action.votes,
            // we can't keep resetting this to false
            voted: false,
          },
        },
        fetchingVotes: false,
      };

    case ACTIONS.GET_VOTES_FAILURE:
      return {
        ...state,
        fetchVotesError: action.error || 'An error occurred getting votes.',
        voting: false,
      };

    case ACTIONS.VOTE:
      return loop(
        { ...state, voting: action.id },
        Cmd.run(voteRequest, {
          successActionCreator: voteSuccess,
          failActionCreator: voteFailure,
          args: [action.body],
        })
      );

    case ACTIONS.VOTE_SUCCESS:
      return {
        ...state,
        votes: {
          ...state.votes,
          [state.voting]: {
            voted: true,
          },
        },
        voting: false,
      };

    case ACTIONS.VOTE_FAILURE:
      return {
        ...state,
        votingError:
          action.error || 'An error occurred while voting. Please try again.',
        voting: false,
      };

    default:
      return state;
  }
}

export {
  getResearchTargetsAction,
  searchResearchTargetsAction,
  submitResearchTargetAction,
  clearSubmissionDataAction,
  getVotesAction,
  voteAction,
};
