import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';

import { ACTIONS as ALERT_ACTIONS } from './alerts';

const ACTIONS = {
  GET_TOKENS: 'FAUCET/GET_TOKENS',
  GET_TOKENS_SUCCESS: 'FAUCET/GET_TOKENS_SUCCESS',
  GET_TOKENS_FAILURE: 'FAUCET/GET_TOKENS_FAILURE',
};

function getTokensAction(address) {
  return {
    type: ACTIONS.GET_TOKENS,
    address,
  };
}

function getTokensRequest(address) {
  return apiRequest('/api/faucet/send-tokens', {
    method: 'post',
    body: { address },
  });
}

function getTokensSuccess(response) {
  return {
    type: ACTIONS.GET_TOKENS_SUCCESS,
    success: true,
  };
}

function getTokensFailure(error) {
  return {
    type: ACTIONS.GET_TOKENS_FAILURE,
    error,
  };
}

const initialState = {
  loading: false,
  success: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_TOKENS:
      return loop(
        { ...state, loading: true },
        Cmd.run(getTokensRequest, {
          successActionCreator: getTokensSuccess,
          failActionCreator: getTokensFailure,
          args: [action.address],
        })
      );

    case ACTIONS.GET_TOKENS_SUCCESS:
      return { ...state, loading: false, success: true };

    case ACTIONS.GET_TOKENS_FAILURE:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert:
            (action.error && action.error.message) ||
            'Oops! Something went wrong... Please try again.',
        })
      );

    default:
      return state;
  }
}

export { getTokensAction };
