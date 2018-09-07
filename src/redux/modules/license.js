import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';

import { ACTIONS as ALERT_ACTIONS } from './alerts';

const ACTIONS = {
  GET_LICENSE: 'LICENSE/GET',
  UPDATE_LICENSE: 'LICENSE/UPDATE',
  UPDATE_LICENSE_SUCCESS: 'LICENSE/UPDATE_LICENSE_SUCCESS',
  UPDATE_LICENSE_FAILURE: 'LICENSE/UPDATE_LICENSE_FAILURE',
  GET_LICENSE_SUCCESS: 'LICENSE/GET_LICENSE_SUCCESS',
  GET_LICENSE_FAILURE: 'LICENSE/GET_LICENSE_FAILURE',
};

function getLicenseAction() {
  return {
    type: ACTIONS.GET_LICENSE,
  };
}

function updateLicenseAction(data) {
  return {
    type: ACTIONS.UPDATE_LICENSE,
    data,
  };
}

function getLicenseRequest() {
  return apiRequest('/api/license', {
    method: 'get',
  });
}

function updateLicenseRequest(data) {
  return apiRequest('/api/license', {
    method: 'put',
    body: { data },
  });
}

function getLicenseSuccess(response) {
  return {
    type: ACTIONS.GET_LICENSE_SUCCESS,
    success: true,
  };
}

function getLicenseFailure(error) {
  return {
    type: ACTIONS.GET_LICENSE_FAILURE,
    error,
  };
}

function updateLicenseSuccess(response) {
  return {
    type: ACTIONS.UPDATE_LICENSE_SUCCESS,
    success: true,
  };
}

function updateLicenseFailure(error) {
  return {
    type: ACTIONS.UPDATE_LICENSE_FAILURE,
    error,
  };
}

const initialState = {
  loading: false,
  success: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.GET_LICENSE:
      return loop(
        { ...state, loading: true },
        Cmd.run(getLicenseRequest, {
          successActionCreator: getLicenseSuccess,
          failActionCreator: getLicenseFailure,
          args: [],
        })
      );

    case ACTIONS.GET_LICENSE_SUCCESS:
      return { ...state, loading: false, success: true };

    case ACTIONS.GET_LICENSE_FAILURE:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert:
            (action.error && action.error.message) ||
            'Oops! Something went wrong... Please try again.',
        })
      );
    case ACTIONS.UPDATE_LICENSE:
      return loop(
        { ...state, loading: true },
        Cmd.run(updateLicenseRequest, {
          successActionCreator: updateLicenseSuccess,
          failActionCreator: updateLicenseFailure,
          args: [action.data],
        })
      );

    case ACTIONS.UPDATE_LICENSE_SUCCESS:
      return { ...state, loading: false, success: true };

    case ACTIONS.UPDATE_LICENSE_FAILURE:
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

export { updateLicenseAction, getLicenseAction };
