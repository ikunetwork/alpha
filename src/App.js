import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Alert from './components/Alert';
import Footer from './components/Footer';
import Web3BrowserRequiredModal from './components/Web3BrowserRequiredModal';
import UnlockMetamaskModal from './components/UnlockMetamaskModal';
import Proposals from './pages/proposal/Proposals';
import Faq from './pages/faq/Faq';
import Home from './pages/home/Home';
import ResearchTarget from './pages/research-target/ResearchTarget';
import Proposal from './pages/proposal/Proposal';
import Account from './pages/account/Account';
import Faucet from './pages/faucet/Faucet';
import Signup from './pages/signup/Signup';
import VerifyEmail from './pages/verify-email/VerifyEmail';
import SubmitResearchTarget from './pages/research-target/SubmitResearchTarget';
import SubmitProposal from './pages/proposal/SubmitProposal';
import ScrollToTop from './components/ScrollToTop';
import Token from './utils/Token';

// actions
import {
  setUserAddressAction,
  logoutAction,
  getUserInfoAction,
} from './redux/modules/user';
import {
  initWeb3Action,
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from './redux/modules/web3';
import { setNetworkIdAction } from './redux/modules/network';
import { getResearchTargetsAction } from './redux/modules/researchTargets';
import { getProposalsAction } from './redux/modules/proposals';
import { getFaqAction } from './redux/modules/faq';

import './css/app.css';

class App extends Component {
  componentWillMount() {
    const initParams = {
      onChangeAddress: address => this.props.setUserAddress(address),
      onChangeNetwork: networkId => this.props.setNetworkId(networkId),
    };
    // [side-effect] for now initWeb3 instantiates a poll for changes
    this.props.initWeb3(initParams);
    this.props.getResearchTargets();
    this.props.getProposals();
    this.props.getFaq();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      // Address has changed, we need to fetch new user info
      this.fetchUserInfo(nextProps.address);
    }
  }

  fetchUserInfo = address => {
    if (address) {
      const token = Token.get(address);
      if (token) {
        this.props.getUserInfo({ [address]: token });
      }
    }
  };

  render() {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)}>
        <ScrollToTop>
          <Alert alert={this.props.alert} />
          <div className={(this.props.user.loggedIn && 'loggedIn') || ''}>
            <Sidebar user={this.props.user} logout={this.props.logout} />
            <Navbar
              user={this.props.user}
              logout={this.props.logout}
              web3={this.props.web3}
              address={this.props.address}
              networkId={this.props.networkId}
            />
            <div className="main container">
              <Route exact path="/" component={Home} />
              <Route
                path="/proposals"
                render={() => (
                  <Proposals
                    user={this.props.user}
                    web3={this.props.web3}
                    address={this.props.address}
                    networkId={this.props.networkId}
                  />
                )}
              />
              <Route path="/faq" component={Faq} />
              <Route
                path="/signup"
                component={_ => (
                  <Signup web3={this.props.web3} address={this.props.address} />
                )}
              />
              <Route path="/verify-email" component={VerifyEmail} />
              <Route
                path="/submit-research-target"
                component={SubmitResearchTarget}
              />
              <Route
                path="/edit-research-target"
                component={SubmitResearchTarget}
              />
              <Route
                path="/submit-proposal"
                render={() => (
                  <SubmitProposal
                    address={this.props.address}
                    loggedIn={this.props.user.loggedIn}
                  />
                )}
              />
              {/* <Route path={`/network-tools`} component={NetworkTools} /> */}
              <Route path="/research-target/:id" component={ResearchTarget} />
              <Route path="/proposal/:id" component={Proposal} />
              <Route
                path="/account"
                render={() => (
                  <Account
                    user={this.props.user}
                    web3={this.props.web3}
                    networkId={this.props.networkId}
                    address={this.props.address}
                    loggedIn={this.props.user.loggedIn}
                  />
                )}
              />
              <Route
                path="/faucet"
                render={() => (
                  <Faucet
                    user={this.props.user}
                    address={this.props.address}
                    web3={this.props.web3}
                  />
                )}
              />
              <Footer networkId={this.props.networkId} />
            </div>
            <Web3BrowserRequiredModal
              show={this.props.noWeb3BrowserModalVisible}
              onClose={_ => this.props.showNoWeb3BrowserModal(false)}
              required={true}
            />
            <UnlockMetamaskModal
              show={this.props.unlockMetamaskModalVisible}
              onClose={_ => this.props.showUnlockMetamaskModal(false)}
              required={true}
            />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default connect(
  state => ({
    alert: state.alerts.globalAlert,
    user: state.user,
    address: state.user.address,
    web3: state.web3,
    networkId: state.network.networkId,
    noWeb3BrowserModalVisible: state.web3.noWeb3BrowserModalVisible,
    unlockMetamaskModalVisible: state.web3.unlockMetamaskModalVisible,
  }),
  dispatch => ({
    setUserAddress: address => dispatch(setUserAddressAction(address)),
    setNetworkId: id => dispatch(setNetworkIdAction(id)),
    initWeb3: params => dispatch(initWeb3Action(params)),
    getResearchTargets: () => dispatch(getResearchTargetsAction()),
    getProposals: () => dispatch(getProposalsAction()),
    getFaq: () => dispatch(getFaqAction()),
    getUserInfo: tokenData => dispatch(getUserInfoAction(tokenData)),
    logout: () => dispatch(logoutAction()),
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
  })
)(App);
