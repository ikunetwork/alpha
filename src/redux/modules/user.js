import { Cmd, loop } from 'redux-loop';

import { ACTIONS as ALERT_ACTIONS } from './alerts';

import apiRequest from '../../utils/Fetch';
import Token from '../../utils/Token';

const ACTIONS = {
  LOGIN: 'USER/LOGIN',
  LOGIN_SUCCESS: 'USER/LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USER/LOGIN_FAILURE',
  GET_USER_INFO: 'USER/GET_USER_INFO',
  GET_USER_INFO_SUCCESS: 'USER/GET_USER_INFO_SUCCESS',
  GET_USER_INFO_FAILURE: 'USER/GET_USER_INFO_FAILURE',
  SET_USER_INFO: 'USER/SET_USER_INFO',
  SET_USER_ADDRESS: 'USER/SET_USER_ADDRESS',
  EDIT_USER_INFO: 'USER/EDIT_USER_INFO',
  EDIT_USER_INFO_SUCCESS: 'USER/EDIT_USER_INFO_SUCCESS',
  EDIT_USER_INFO_FAILURE: 'USER/EDIT_USER_INFO_FAILURE',
  LOGOUT: 'USER/LOGOUT',
};

// LOGIN
function loginAction({ address, sign }) {
  return {
    type: ACTIONS.LOGIN,
    address,
    sign,
  };
}

function loginRequest(address, sign) {
  return apiRequest('/api/user/login', {
    method: 'post',
    body: {
      address,
      sign,
    },
  });
}

function loginRequestSuccess({ token }) {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    token,
  };
}

function loginRequestFailure(error) {
  return {
    type: ACTIONS.LOGIN_FAILURE,
    error,
  };
}

// USER INFO
function getUserInfoAction(params = {}) {
  const { tokenData } = params;
  return { type: ACTIONS.GET_USER_INFO, tokenData };
}

function getUserInfoRequest(token, tokenData) {
  // Stores tokens for future usage when looped from loginRequest
  // >> see LOGIN_SUCCESS
  if (tokenData) {
    Token.store(tokenData);
  }

  return apiRequest('/api/user/me', {
    method: 'get',
    jwt_auth: token,
  });
}

function getUserInfoRequestSuccess(user) {
  return {
    type: ACTIONS.GET_USER_INFO_SUCCESS,
    user,
  };
}

function getUserInfoRequestFailure(error) {
  return {
    type: ACTIONS.GET_USER_INFO_FAILURE,
    error,
  };
}

function setUserInfoAction(fields) {
  return {
    type: ACTIONS.SET_USER_INFO,
    fields,
  };
}

function setUserAddressAction(address) {
  return {
    type: ACTIONS.SET_USER_ADDRESS,
    address,
  };
}

function editUserInfoAction(fields) {
  return {
    type: ACTIONS.EDIT_USER_INFO,
    fields,
  };
}

function editUserInfoRequest(fields, address) {
  return apiRequest('/api/user/me', {
    method: 'patch',
    body: { ...fields },
    jwt_auth: Token.get(address),
  });
}

function editUserInfoSuccess(user) {
  return {
    type: ACTIONS.EDIT_USER_INFO_SUCCESS,
    user,
  };
}

function editUserInfoFailure({ error }) {
  return {
    type: ACTIONS.EDIT_USER_INFO_FAILURE,
    error,
  };
}

function logoutAction() {
  Token.remove();
  return {
    type: ACTIONS.LOGOUT,
  };
}

const initialState = {
  loggedIn: false,
  loading: false,
  loggingIn: false,
  address: null,
  error: null,
  editingInfo: false,
  editError: null,
};

export default function reducer(state = initialState, action) {
  // reducer enhanced by redux-loop
  // https://redux-loop.js.org/docs/api-docs/loop.html

  switch (action.type) {
    case ACTIONS.LOGIN:
      return loop(
        { ...state, loggingIn: true },
        Cmd.run(loginRequest, {
          successActionCreator: loginRequestSuccess,
          failActionCreator: loginRequestFailure,
          args: [action.address, action.sign],
        })
      );

    case ACTIONS.LOGIN_SUCCESS:
      return loop(
        {
          ...state,
          loggingIn: false,
          loggedIn: true,
        },
        Cmd.action({
          type: ACTIONS.GET_USER_INFO,
          token: action.token,
          tokenData: {
            [state.address]: action.token,
          },
        })
      );

    case ACTIONS.LOGIN_FAILURE:
      return loop(
        { ...state, loggingIn: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    case ACTIONS.GET_USER_INFO:
      return loop(
        { ...state, loading: true },
        Cmd.run(getUserInfoRequest, {
          successActionCreator: getUserInfoRequestSuccess,
          failActionCreator: getUserInfoRequestFailure,
          args: [Token.get(state.address) || action.token, action.tokenData],
        })
      );

    case ACTIONS.GET_USER_INFO_SUCCESS:
      return loop(
        { ...state, loading: false, loggedIn: true },
        Cmd.action({
          type: ACTIONS.SET_USER_INFO,
          fields: { ...action.user },
        })
      );

    case ACTIONS.GET_USER_INFO_FAILURE:
      return loop(
        { ...state, loading: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    case ACTIONS.EDIT_USER_INFO:
      return loop(
        { ...state, editingInfo: true },
        Cmd.run(editUserInfoRequest, {
          successActionCreator: editUserInfoSuccess,
          failActionCreator: editUserInfoFailure,
          args: [action.fields, state.address],
        })
      );

    case ACTIONS.EDIT_USER_INFO_SUCCESS:
      return loop(
        { ...state, editingInfo: false },
        Cmd.action({
          type: ACTIONS.SET_USER_INFO,
          fields: { ...action.user },
        })
      );

    case ACTIONS.EDIT_USER_INFO_FAILURE:
      return loop(
        { ...state, editingInfo: false },
        Cmd.action({
          type: ALERT_ACTIONS.SET_GLOBAL_ALERT,
          alert: action.error,
        })
      );

    case ACTIONS.SET_USER_INFO:
      return {
        ...state,
        ...action.fields,
      };

    case ACTIONS.SET_USER_ADDRESS:
      return {
        ...state,
        address: action.address,
      };

    case ACTIONS.LOGOUT:
      // user.address required when logged out
      return { ...initialState, address: state.address };

    default:
      return state;
  }
}

export {
  loginAction,
  getUserInfoAction,
  setUserInfoAction,
  setUserAddressAction,
  editUserInfoAction,
  logoutAction,
  ACTIONS,
};
