import { Cmd, loop } from 'redux-loop';

import { ACTIONS as ALERT_ACTIONS } from './alerts';

import apiRequest from '../../utils/Fetch';
import Token from '../../utils/Token';
import { ACTIONS as USER_ACTIONS } from './user';

const ACTIONS = {
  SIGNUP: 'SIGNUP/SIGNUP',
  SIGNUP_SUCCESS: 'SIGNUP/SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP/SIGNUP_FAILURE',
  SET_NEW_USER_FIELDS: 'SIGNUP/SET_NEW_USER_FIELDS',
  SET_NEW_USER_FIELDS_SUCCESS: 'SIGNUP/SET_NEW_USER_FIELDS_SUCCESS',
  RESEND_SIGNUP_EMAIL: 'SIGNUP/RESEND_SIGNUP_EMAIL',
  RESEND_SIGNUP_EMAIL_SUCCESS: 'SIGNUP/RESEND_SIGNUP_EMAIL_SUCCESS',
  RESEND_SIGNUP_EMAIL_FAILURE: 'SIGNUP/RESEND_SIGNUP_EMAIL_FAILURE',
  VERIFY_EMAIL: 'SIGNUP/VERIFY_EMAIL',
  VERIFY_EMAIL_SUCCESS: 'SIGNUP/VERIFY_EMAIL_SUCCESS',
  VERIFY_EMAIL_FAILURE: 'SIGNUP/VERIFY_EMAIL_FAILURE',
};

function signupAction({ address, sign, fields }) {
  return {
    type: ACTIONS.SIGNUP,
    address,
    sign,
    fields,
  };
}

function signupRequest(address, sign) {
  return apiRequest('/api/user/signup', {
    method: 'post',
    body: {
      address,
      sign,
    },
  });
}

function signupSuccess({ token }) {
  return {
    type: ACTIONS.SIGNUP_SUCCESS,
    token,
  };
}

function signupFailure({ error }) {
  return {
    type: ACTIONS.SIGNUP_FAILURE,
    error,
  };
}

function setNewUserFieldsRequest(fields, tokenData, address) {
  Token.store(tokenData);
  return apiRequest('/api/user/me', {
    method: 'patch',
    body: { ...fields },
    jwt_auth: Token.get(address),
  });
}

function setNewUserFieldsSuccess(fields) {
  return {
    type: ACTIONS.SET_NEW_USER_FIELDS_SUCCESS,
    fields,
  };
}

function resendSignupEmailAction(address) {
  return {
    type: ACTIONS.RESEND_SIGNUP_EMAIL,
    address,
  };
}

function resendSignupEmailRequest(address) {
  return apiRequest('/api/user/resend-email', {
    method: 'post',
    body: {},
    jwt_auth: Token.get(address),
  });
}

function resendSignupEmailSuccess() {
  return {
    type: ACTIONS.RESEND_SIGNUP_EMAIL_SUCCESS,
  };
}

function verifyEmailAction(token) {
  return {
    type: ACTIONS.VERIFY_EMAIL,
    token,
  };
}

function verifyEmailRequest(token) {
  return apiRequest('/api/user/verify-email', {
    method: 'post',
    body: {},
    jwt_auth: token,
  });
}

function verifyEmailSuccess(fields) {
  return {
    type: ACTIONS.VERIFY_EMAIL_SUCCESS,
    fields,
  };
}

function verifyEmailFailure({ error }) {
  return {
    type: ACTIONS.VERIFY_EMAIL_FAILURE,
    error,
  };
}

const initialState = {
  loading: false,
  address: null,
  done: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SIGNUP:
      return loop(
        {
          ...state,
          loading: true,
          address: action.address,
          fields: action.fields,
        },
        Cmd.run(signupRequest, {
          successActionCreator: signupSuccess,
          failActionCreator: signupFailure,
          args: [action.address, action.sign],
        })
      );

    case ACTIONS.SIGNUP_SUCCESS:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ACTIONS.SET_NEW_USER_FIELDS,
          tokenData: {
            [state.address]: action.token,
          },
          fields: action.fields,
        })
      );

    case ACTIONS.SIGNUP_FAILURE:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    case ACTIONS.SET_NEW_USER_FIELDS:
      return loop(
        state,
        Cmd.run(setNewUserFieldsRequest, {
          successActionCreator: setNewUserFieldsSuccess,
          // beware: using a generic error handler
          failActionCreator: signupFailure,
          args: [state.fields, action.tokenData, state.address],
        })
      );

    case ACTIONS.SET_NEW_USER_FIELDS_SUCCESS:
      return { ...state, done: true };

    case ACTIONS.RESEND_SIGNUP_EMAIL:
      return loop(
        state,
        Cmd.run(resendSignupEmailRequest, {
          successActionCreator: resendSignupEmailSuccess,
          failActionCreator: signupFailure,
          args: [action.address],
        })
      );

    case ACTIONS.RESEND_SIGNUP_EMAIL_SUCCESS:
      return loop(
        state,
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert:
            'The verification email has been re-sent. Please check your inbox.',
        })
      );

    case ACTIONS.VERIFY_EMAIL:
      return loop(
        { ...state, verifyingEmail: true },
        Cmd.run(verifyEmailRequest, {
          successActionCreator: verifyEmailSuccess,
          failActionCreator: verifyEmailFailure,
          args: [action.token],
        })
      );

    case ACTIONS.VERIFY_EMAIL_SUCCESS:
      return loop(
        { ...state, verifyingEmail: false },
        Cmd.action({
          type: USER_ACTIONS.SET_USER_INFO,
          fields: action.fields,
        })
      );

    case ACTIONS.VERIFY_EMAIL_FAILURE:
      return loop(
        { ...state, verifyingEmail: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    default:
      return state;
  }
}

export { signupAction, resendSignupEmailAction, verifyEmailAction };
