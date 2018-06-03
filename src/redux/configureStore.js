import { createStore } from 'redux';
import { install as installReduxLoop, combineReducers } from 'redux-loop';

import alerts from './modules/alerts';
import faq from './modules/faq';
import faucet from './modules/faucet';
import network from './modules/network';
import proposals from './modules/proposals';
import researchTargets from './modules/researchTargets';
import signUp from './modules/signUp';
import user from './modules/user';
import web3 from './modules/web3';

const reducer = combineReducers({
  alerts,
  faq,
  faucet,
  network,
  proposals,
  researchTargets,
  signUp,
  user,
  web3,
});

const configureStore = initialState =>
  installReduxLoop()(createStore)(reducer, initialState);

export default configureStore;
