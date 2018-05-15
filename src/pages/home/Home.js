import React, { Component } from 'react';
import { connect } from 'react-redux';
// import animateScrollTo from 'animated-scroll-to';
import { Link } from 'react-router-dom';
import ResearchTargetCard from '../../components/ResearchTargetCard';
import Loader from '../../components/Loader';

import { searchResearchTargetsAction } from '../../redux/modules/researchTargets';

import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  getCards() {
    return this.state.query.length && this.props.searchResults
      ? this.props.searchResults
      : this.props.researchTargets;
  }

  doSearch() {
    // apparently not in use ATM:
    // uncomment animateScrollTo when we implement search
    this.props.searchResearchTargets(this.state.query);
  }

  renderRT() {
    return this.getCards().map((item, i) => (
      <div className="col-md-4 col-sm-12" key={`rt-${i.toString()}`}>
        <ResearchTargetCard item={item} />
      </div>
    ));
  }

  renderNoResults() {
    return (
      <p className="no-results">
        We couldn't find any results for "{this.state.query}"
      </p>
    );
  }

  renderLoader = () => (
    <div className="row">
      <Loader />
    </div>
  );

  renderCards = () => (
    <div className="section" id="cards">
      <div className="container tim-container">
        <div className="research-targets">
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <div className="title">
                <h2>Research Targets</h2>
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div className="section-action">
                <Link
                  to="/submit-research-target"
                  className="btn btn-outline-default btn-round btn-file"
                >
                  <i className="fa fa-plus" /> Submit Research Target
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            {this.getCards().length ? this.renderRT() : this.renderNoResults()}
          </div>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div className="home">
        <div className="wrapper">
          {(this.props.loading && this.renderLoader()) || this.renderCards()}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    researchTargets: state.researchTargets.researchTargets,
    searchResults: state.researchTargets.searchResults,
    loading: state.researchTargets.loading,
  }),
  dispatch => ({
    search: query => dispatch(searchResearchTargetsAction(query)),
  })
)(Home);
