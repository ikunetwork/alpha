import { Cmd, loop } from 'redux-loop';

import Web3Helper from '../../utils/Web3Helper';
import { ACTIONS as USER_ACTIONS } from './user';
import { ACTIONS as NETWORK_ACTIONS } from './network';

const ACTIONS = {
  INIT_WEB3: 'WEB3/INIT_WEB3',
  GET_WEB3: 'WEB3/GET_WEB3',
  GET_WEB3_SUCCESS: 'WEB3/GET_WEB3_SUCCESS',
  GET_WEB3_FAILURE: 'WEB3/GET_WEB3_FAILURE',
  SET_WEB3: 'WEB3/SET_WEB3',
  GET_WEB3_NETWORK: 'WEB3/GET_WEB3_NETWORK',
  GET_WEB3_ACCOUNTS: 'WEB3/GET_WEB3_ACCOUNTS',
  POLL_FOR_WEB3_CHANGES: 'WEB3/POLL_FOR_CHANGES',
  SHOW_NO_WEB3_BROWSER_MODAL: 'WEB3/SHOW_NO_WEB3_BROWSER_MODAL',
  SHOW_UNLOCK_METAMASK_MODAL: 'WEB3/SHOW_UNLOCK_METAMASK_MODAL',
};

function initWeb3Action({ onChangeAddress, onChangeNetwork }) {
  return {
    type: ACTIONS.INIT_WEB3,
    onChangeAddress,
    onChangeNetwork,
  };
}

function getWeb3Action() {
  return {
    type: ACTIONS.GET_WEB3,
  };
}

function getWeb3Success(results) {
  const { web3 } = results;
  return {
    type: ACTIONS.GET_WEB3_SUCCESS,
    data: web3,
  };
}

function getWeb3Failure(error) {
  return {
    type: ACTIONS.GET_WEB3_FAILURE,
    error,
  };
}

function showNoWeb3BrowserModalAction(show) {
  return {
    type: ACTIONS.SHOW_NO_WEB3_BROWSER_MODAL,
    show,
  };
}

function showUnlockMetamaskModalAction(show) {
  return {
    type: ACTIONS.SHOW_UNLOCK_METAMASK_MODAL,
    show,
  };
}

function startListening(
  web3eth,
  web3version,
  currentAddress,
  currentNetworkId,
  onChangeAddress,
  onChangeNetwork
) {
  setInterval(() => {
    web3eth.getAccounts((error, response) => {
      if (!error) {
        const address = response[0];
        if (address !== currentAddress) {
          onChangeAddress(address);
        }
      } else {
        console.log('Error fetching web3 address: ', error);
      }
    });

    web3version.getNetwork((error, networkId) => {
      if (!error) {
        if (networkId !== currentNetworkId) {
          onChangeNetwork(networkId);
        }
      } else {
        console.log('Error fetching web3 network: ', error);
      }
    });
  }, 2000);
}

function setWeb3Action(data) {
  return {
    type: ACTIONS.SET_WEB3,
    data,
  };
}

const initialState = {
  ready: false,
  pollingForChanges: false,
  noWeb3BrowserModalVisible: false,
  unlockMetamaskModalVisible: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.INIT_WEB3:
      return loop(
        {
          ...state,
          startPoll: true,
          onChangeAddress: action.onChangeAddress,
          onChangeNetwork: action.onChangeNetwork,
        },
        Cmd.action({ type: ACTIONS.GET_WEB3 })
      );

    case ACTIONS.GET_WEB3:
      return loop(
        {
          ...state,
          loading: true,
        },
        Cmd.run(Web3Helper.getWeb3, {
          successActionCreator: getWeb3Success,
          failActionCreator: getWeb3Failure,
        })
      );

    case ACTIONS.GET_WEB3_SUCCESS:
      return loop(
        {
          ...state,
          loading: false,
          ready: true,
        },
        // create action list
        Cmd.list(
          [
            {
              type: ACTIONS.SET_WEB3,
              data: action.data,
            },
            (state.startPoll && {
              type: ACTIONS.POLL_FOR_WEB3_CHANGES,
              address: action.data.eth.accounts[0],
              networkId: action.data.version.network,
            }) ||
              null,
            {
              type: USER_ACTIONS.SET_USER_ADDRESS,
              address: action.data.eth.accounts[0],
            },
            {
              type: NETWORK_ACTIONS.SET_NETWORK_ID,
              id: action.data.version.network,
            },
          ]
            // remove null actions
            .filter(a => a)
            // map Cmd.action to dispatch
            .map(a => Cmd.action(a))
        )
      );

    case ACTIONS.GET_WEB3_FAILURE:
      return {
        ...state,
        loading: false,
        ready: false,
        error: action.error,
      };

    case ACTIONS.SET_WEB3:
      return { ...state, ...action.data };

    case ACTIONS.POLL_FOR_WEB3_CHANGES:
      // dirty side effect below:
      startListening(
        state.eth,
        state.version,
        action.address,
        action.networkId,
        state.onChangeAddress,
        state.onChangeNetwork
      );
      return {
        ...state,
        startPoll: false,
      };

    case ACTIONS.SHOW_NO_WEB3_BROWSER_MODAL:
      return {
        ...state,
        noWeb3BrowserModalVisible: action.show,
      };

    case ACTIONS.SHOW_UNLOCK_METAMASK_MODAL:
      return {
        ...state,
        unlockMetamaskModalVisible: action.show,
      };

    default:
      return state;
  }
}

export {
  initWeb3Action,
  getWeb3Action,
  setWeb3Action,
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
};
