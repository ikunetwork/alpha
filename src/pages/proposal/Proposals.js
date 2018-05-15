import React, { Component } from 'react';
import { connect } from 'react-redux';
// import animateScrollTo from 'animated-scroll-to';
import { Link } from 'react-router-dom';

import ProposalCard from '../../components/ProposalCard';
import Loader from '../../components/Loader';
import IkuTokenHelper from '../../utils/IkuTokenHelper';

import { searchProposalsAction } from '../../redux/modules/proposals';

import './Proposals.css';

class Proposals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      userTokenBalance: 0,
    };
  }

  componentWillMount() {
    if (this.props.web3 && this.props.address) {
      this.getBalance(this.props.web3, this.props.address);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.web3 && nextProps.address) {
      this.getBalance(nextProps.web3, nextProps.address);
    }
  }

  getCards() {
    return this.state.query.length && this.props.searchResults
      ? this.props.searchResults
      : this.props.proposals;
  }

  getBalance(web3, address) {
    IkuTokenHelper.getBalance(web3.currentProvider, address).then(balance => {
      this.setState({ userTokenBalance: balance });
    });
  }

  doSearch() {
    this.props.searchProposals(this.state.query);
  }

  renderProposals() {
    if (this.props.proposals && this.props.proposals.length > 0) {
      return this.props.proposals.map((item, i) => (
        <div className="col-md-4 col-sm-6" key={`proposals-${i.toString()}`}>
          <ProposalCard
            item={item}
            web3={this.props.web3}
            address={this.props.address}
            networkId={this.props.networkId}
            user={this.props.user}
          />
        </div>
      ));
    }
    return null;
  }

  renderNoResults() {
    return (
      <p className="no-results">
        We couldn't find any results for "{this.state.query}"
      </p>
    );
  }

  renderSubmitProposalButton() {
    if (!this.state.userTokenBalance) {
      return null;
    }

    const canCreate =
      this.state.userTokenBalance &&
      this.state.userTokenBalance.gt(0) &&
      this.props.user.loggedIn;

    if (canCreate) {
      return (
        <div className="section-action">
          <Link
            to="/submit-proposal"
            className="btn btn-outline-default btn-round btn-file"
          >
            <i className="fa fa-plus" /> Submit a Proposal
          </Link>
        </div>
      );
    }

    return null;
  }

  renderLoader = () => (
    <div className="row">
      <Loader />
    </div>
  );

  renderCards = () => (
    <div className="section" id="cards">
      <div className="container tim-container">
        <div className="proposals">
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <div className="title">
                <h2>Proposals</h2>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              {this.renderSubmitProposalButton()}
            </div>
          </div>

          <div className="row">
            {this.getCards().length || !this.state.query.length
              ? this.renderProposals()
              : this.renderNoResults()}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div className="proposals">
        <div className="wrapper">
          {(this.props.loading && this.renderLoader()) || this.renderCards()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    proposals: state.proposals.proposals,
    searchResults: state.proposals.searchResults,
    loading: state.proposals.loading,
  }),
  dispatch => ({
    search: query => dispatch(searchProposalsAction(query)),
  })
)(Proposals);
