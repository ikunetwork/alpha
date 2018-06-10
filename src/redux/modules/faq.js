import { Cmd, loop } from 'redux-loop';

import { ACTIONS as ALERT_ACTIONS } from './alerts';

import apiRequest from '../../utils/Fetch';

const ACTIONS = {
  GET_FAQ: 'FAQ/GET_FAQ',
  GET_FAQ_SUCCESS: 'FAQ/GET_FAQ_SUCCESS',
  GET_FAQ_FAILURE: 'FAQ/GET_FAQ_FAILURE',
  SET_FAQ: 'FAQ/SET_FAQ',
};

function getFaqAction() {
  return {
    type: ACTIONS.GET_FAQ,
  };
}

function getFaqRequest() {
  return apiRequest('/api/faq', {});
}

function getFaqSuccess(faq) {
  return {
    type: ACTIONS.GET_FAQ_SUCCESS,
    faq,
  };
}

function getFaqFailure(error) {
  return {
    type: ACTIONS.GET_FAQ_FAILURE,
    error,
  };
}

const initialState = {
  loading: false,
  faq: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_FAQ:
      return loop(
        { ...state, loading: true },
        Cmd.run(getFaqRequest, {
          successActionCreator: getFaqSuccess,
          failActionCreator: getFaqFailure,
        })
      );

    case ACTIONS.GET_FAQ_SUCCESS:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ACTIONS.SET_FAQ,
          faq: action.faq,
        })
      );

    case ACTIONS.GET_FAQ_FAILURE:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    case ACTIONS.SET_FAQ:
      return { ...state, faq: action.faq };

    default:
      return state;
  }
}

export { getFaqAction };
