import { Cmd, loop } from 'redux-loop';

import apiRequest from '../../utils/Fetch';

const ACTIONS = {
  SET_GLOBAL_ALERT: 'ALERTS/SET_GLOBAL_ALERT',
  CLEAR_GLOBAL_ALERT: 'ALERTS/CLEAR_GLOBAL_ALERT',
};

function setGlobalAlertAction(alert) {
  return {
    type: ACTIONS.SET_GLOBAL_ALERT,
    alert,
  };
}

function clearGlobalAlertAction() {
  return {
    type: ACTIONS.CLEAR_GLOBAL_ALERT,
  };
}

const initialState = {
  globalAlert: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_GLOBAL_ALERT:
      return loop({ ...state, globalAlert: action.alert }, Cmd.none);

    case ACTIONS.CLEAR_GLOBAL_ALERT:
      return loop({ ...state, globalAlert: null }, Cmd.none);

    default:
      return state;
  }
}

export { setGlobalAlertAction, clearGlobalAlertAction };