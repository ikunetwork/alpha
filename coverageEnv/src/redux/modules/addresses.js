const SET_ADDRESS = 'ADDRESSES/SET_ADDRESS';

export function setAddressAction(address) {
  return {
    type: SET_ADDRESS,
    address,
  };
}

const initialState = {
  address: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADDRESS:
      return {
        address: action.address,
      };
    default:
      return state;
  }
}
