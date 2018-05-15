const ACTIONS = {
  SET_NETWORK_ID: 'NETWORK/SET_NETWORK_ID',
};

function setNetworkIdAction(id) {
  return {
    type: ACTIONS.SET_NETWORK_ID,
    id,
  };
}

const initialState = {
  networkId: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTIONS.SET_NETWORK_ID:
      return { ...state, networkId: action.id };
    default:
      return state;
  }
}

export { setNetworkIdAction, ACTIONS };
