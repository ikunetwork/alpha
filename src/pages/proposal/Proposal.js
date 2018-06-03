import React, { Component } from 'react';
import Contract from 'truffle-contract';
import Datetime from 'react-datetime';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { downloadText } from 'download.js';
import { connect } from 'react-redux';

import apiRequest from '../../utils/Fetch';
import Currency from '../../utils/Currency';
import RSTCrowdsale from '../../../build/contracts/RSTCrowdsale.json';
import Token from '../../utils/Token';
import EtherscanUrlHelper from '../../utils/EtherscanUrlHelper';
import Loader from '../../components/Loader';
import ContributeModal from '../../components/ContributeModal';
import ProposalInfo from '../../components/ProposalInfo';
import Title from '../../components/Title';
import TimeCountdown from '../../components/TimeCountdown';
import ProposalComments from '../../components/ProposalComments';
import ProposalUpdates from '../../components/ProposalUpdates';
import ProposalData from '../../components/ProposalData';

import {
  showNoWeb3BrowserModalAction,
  showUnlockMetamaskModalAction,
} from '../../redux/modules/web3';

import {
  setGlobalAlertAction,
  clearGlobalAlertAction,
} from '../../redux/modules/alerts';

import './Proposal.css';

class Proposal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: null,
      amount_raised: 0,
      amount_raised_usd: 0,
      funds_required_usd: 0,
      funds_required: 0,
      show_contribute_modal: false,
      contributed: false,
      contribute_loading: false,
      contribution_tx: null,
      claim_status: false,
      accessingData: false,
      accessingLicense: false,
      votes: null,
      tabIndex: 0,
    };

    this.currentUrl = this.getCurrentUrl();
    this.contractInstance = null;
    this.pollingHandler = null;
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  onDataUploadSuccess(ipfs_hash, encryption_key) {
    apiRequest('/api/proposal', {
      method: 'put',
      body: {
        ipfs_hash,
        encryption_key,
        id: this.state.info.id,
      },
    }).then(response => {
      this.setState({ info: response });
    });
  }

  getCurrentUrl() {
    return `${window.location.protocol}//${window.location.host}${
      this.props.location.pathname
    }${window.location.search}`;
  }

  getData(silent = false) {
    if (!silent) {
      this.setState({ ready: false });
    }

    const id = this.state.info
      ? this.state.info.id
      : this.props.location.pathname.replace('/proposal/', '');
    const data = { id };

    // Fetch blockchain data from the backend if web3 not available
    if (!this.props.web3.ready) {
      data.web3 = true;
    }

    apiRequest(
      '/api/proposal',
      {
        method: 'get',
      },
      data
    )
      .then(response => {
        let newState = {
          ready: true,
          info: response,
          funds_required: response.funds_required,
        };
        if (data.web3 && response.amount_raised) {
          newState = {
            ...newState,
            amount_raised: response.amount_raised,
            amount_raised_usd: Currency.ethToUSD(
              response.amount_raised,
              this.eth_price_usd
            ).toNumber(),
          };
        }

        this.setState(newState, _ => {
          if (response.approved) {
            // Deploying to the blockchain!
            if (!response.start_time) {
              // Start polling
              this.startProposalPollingIfNeeded();
            } else {
              // Stop polling
              this.stopProposalPollingIfNeeded();
              // Update UI on start time
              this.refreshProposalOnStartTimeIfNeeded();
            }
          }
        });

        return this.init();
      })
      .catch(e => {
        console.log('Error while fetching proposal', e);
      });
  }

  getContractInstance() {
    const contract = Contract(RSTCrowdsale);
    contract.setProvider(this.props.web3.currentProvider);
    return contract.at(this.state.info.address);
  }

  getContentByStatus(real_status) {
    const { end_time } = this.state.info;

    switch (real_status) {
      case 'Active':
        return (
          <div className="row">
            {this.renderTimeLeft()}
            {this.renderFundedPercentage()}
          </div>
        );
      case 'Funded':
        return (
          <div>
            <div className="row">
              {this.renderTimeLeft()}
              {this.renderFundedPercentage()}
            </div>
            <div>
              <div className="row" key="ended-badge">
                <button type="button" className="btn-disabled">
                  No Longer Accepting Contributions
                </button>
              </div>
              <div className="row funded" key="funded-text">
                <i className="fa fa-check" /> This proposal has reached its
                goal!
              </div>
            </div>
          </div>
        );
      case 'Starting soon':
        return (
          <div className="row time-left starting">
            {this.renderTimeToStart()}
          </div>
        );
      case 'Ended':
        return (
          <div>
            <div className="row time-left ended" key="ended-time">
              <i className="fa fa-clock-o" /> Ended at{' '}
              {Datetime.moment.unix(end_time).format('MM/DD/YYYY HH:mm:ss')}
            </div>
            <div className="row" key="ended-badge">
              <button type="button" className="btn-disabled">
                {this.isProposalFunded()
                  ? 'This proposal has reached its goal'
                  : 'This proposal did not reach its goal'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  getVotes() {
    const id = this.state.info
      ? this.state.info.id
      : this.props.location.pathname.replace('/proposal/', '');

    apiRequest(
      '/api/proposal/vote',
      {
        method: 'get',
      },
      { id }
    )
      .then(response => {
        this.setState({
          votes: response.votes,
        });
      })
      .catch(e => {
        console.log('Error while fetching vote count', e);
      });
  }

  async init() {
    this.eth_price_usd = await Currency.getEtherPriceInUSD();
    if (!this.state.info) {
      this.getData();
    } else {
      this.setState({
        funds_required_usd: Currency.ethToUSD(
          this.state.funds_required,
          this.eth_price_usd
        ).toNumber(),
      });

      this.getVotes();

      // Fetch contract data from the blockchain
      if (this.state.info.address && this.props.web3.ready) {
        this.getContractInstance()
          .then(instance => {
            this.contractInstance = instance;

            this.contractInstance
              .weiRaised()
              .then(wei => {
                this.setState({
                  amount_raised: Currency.weiToETH(wei).toNumber(),
                  amount_raised_usd: Currency.weiToUSD(
                    wei,
                    this.eth_price_usd
                  ).toNumber(),
                });
              })
              .catch(e => {
                console.log('THERE WAS AN ERROR getting wei ', e);
              });
          })
          .catch(e => {
            console.log('THERE WAS AN ERROR getting instance ', e);
          });
      }
    }
  }

  showContributeModal() {
    if (this.props.web3.ready) {
      if (!this.props.user || !this.props.user.address) {
        this.props.showUnlockMetamaskModal(true);
      } else {
        this.setState({ show_contribute_modal: true });
      }
    } else {
      this.props.showNoWeb3BrowserModal(true);
    }
  }

  isProposalOwner() {
    if (
      this.props.user &&
      this.props.user.address === this.state.info.creator_address
    ) {
      return true;
    }

    return false;
  }

  contribute(amount) {
    const data = {
      from: this.props.user.address,
      gas: 150000,
      value: Currency.ethToWei(amount).toString(10),
    };

    this.setState({ contribute_loading: true });
    this.getContractInstance()
      .buyTokens(data.from, data)
      .then(result => {
        this.setState({
          contributed: true,
          contribute_loading: false,
          contribution_tx: result.tx,
        });
      })
      .catch(e => {
        console.log('Error while contributing to the proposal', data, e);
      });
  }

  formatDate = () => {
    const _ = new Date(this.state.info.created_at);
    const options = {};

    return _.toLocaleDateString('en-US', options);
  };

  share(platform) {
    let url;

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer.php?u=${this.currentUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/share?url=${
        this.currentUrl
      }&amp;text=Learn more about ${this.state.info.name} at iku.network`;
    }

    window.open(url, '', 'width=500,height=400,resizable=yes').focus();
  }

  startProposalPollingIfNeeded() {
    if (!this.pollingHandler) {
      this.pollingHandler = setInterval(_ => {
        this.getData(true);
      }, 5000);
    }
  }

  stopProposalPollingIfNeeded() {
    if (this.pollingHandler) {
      clearInterval(this.pollingHandler);
    }
  }

  refreshProposalOnStartTimeIfNeeded() {
    if (!this.refreshProposalHandler) {
      if (this.state.info.start_time > parseInt(Date.now() / 1000, 10)) {
        this.refreshProposalHandler = setInterval(_ => {
          const now = parseInt(Date.now() / 1000, 10);
          if (this.state.info.start_time <= now) {
            clearInterval(this.refreshProposalHandler);
            this.getData();
          }
        }, 1000);
      }
    }
  }

  vote() {
    if (this.state.done) {
      this.props.setAlert('You already voted!');
      return false;
    }

    apiRequest('/api/proposal/vote', {
      method: 'post',
      body: {
        id: this.state.info.id,
      },
    })
      .then(response => {
        if (response.success) {
          this.setState({
            done: true,
            votes: this.state.votes + 1,
          });

          if (response.activated) {
            this.props.setAlert('Thanks to your vote the proposal has been approved by the network!');
            this.getData();
          }
        } else {
          this.props.setAlert('You already voted');
          this.setState({
            done: true,
          });
        }
      })
      .catch(err => {
        console.log('error while voting', err);
      });
  }

  claimRefund() {
    this.setState({
      claim_status: 'loading',
    });
    this.getContractInstance()
      .claimRefund({
        from: this.props.user.address,
        gas: 150000,
      })
      .then(r => {
        this.setState({
          claim_status: r.tx,
        });
      })
      .catch(e => {
        console.log('Error while claiming refunds'.e);
      });
  }

  requestAccessToData() {
    // TO DO => User needs to sign some shit
    // TO make sure they are the owners of the eth address
    // that we are gonna validate token amount
    // In the meantime, all users requesting a license, need to be registered
    this.setState({ accessingData: true });

    apiRequest(
      '/api/proposal/data',
      {
        method: 'get',
        jwt_auth: Token.get(this.state.props.address),
      },
      {
        id: this.state.info.id,
      }
    )
      .then(response => {
        if (response.content) {
          downloadText('data.txt', response.content);
        } else {
          let msg = 'Ooops! something went wrong...';
          if (response.message) {
            msg = response.message;
          }
          this.props.setAlert(msg);
        }
        this.setState({ accessingData: false });
      })
      .catch(error => {
        if (error.message) {
          this.props.setAlert(error.message);
        }
        console.log(
          'There was an error while requesting access to data',
          error
        );
        this.setState({ accessingData: false });
      });
  }

  requestAccessToLicense(e) {
    this.setState({ accessingLicense: true });

    apiRequest(
      '/api/proposal/license',
      {
        method: 'get',
        jwt_auth: Token.get(this.props.user.address),
      },
      {
        id: this.state.info.id,
      }
    )
      .then(response => {
        if (response.content) {
          downloadText('license.txt', response.content);
        } else {
          let msg = 'Ooops! something went wrong...';
          if (response.message) {
            msg = response.message;
          }
          this.props.setAlert(msg);
        }
        this.setState({ accessingLicense: false });
      })
      .catch(error => {
        if (error.message) {
          this.props.setAlert(error.message);
        }
        console.log(
          'There was an error while requesting access to license',
          error
        );
        this.setState({ accessingLicense: false });
      });
  }

  isProposalFunded() {
    if (
      parseFloat(this.state.funds_required) ===
      parseFloat(this.state.amount_raised)
    ) {
      return true;
    }

    return false;
  }

  closeContributeModal() {
    if (this.state.contributed) {
      this.init();
    }

    this.setState({ show_contribute_modal: false, contributed: false });
  }

  showComments = () => {
    this.setState({ tabIndex: 1 });
    this.tabsRef.scrollIntoView();
  };

  renderFundedPercentage() {
    const percentage = Math.ceil(
      this.state.amount_raised * 100 / this.state.funds_required
    );

    return (
      <div className="time-left col-md-6">
        <span className="days-left-count">{percentage}%</span>
        <span className="days-left-word">FUNDED</span>
      </div>
    );
  }

  renderCTAs(status) {
    if (status === 'Starting soon') {
      // In the future we could add
      // a CTA to notify users when the crowdsale goes live
      return null;
    } else if (status === 'Active') {
      return (
        <div className="row">
          <button
            type="button"
            className="btn btn-iku btn-big"
            onClick={_ => this.showContributeModal()}
          >
            Contribute to this Proposal
          </button>
        </div>
      );
    } else if (status === 'Ended') {
      if (this.state.amount_raised >= this.state.funds_required) {
        // Project was funded
        if (this.state.info.finalized) {
          return (
            <div className="row funded">
              <i className="fa fa-check" /> Funds have been transferred to the
              proposal creator.
              <a
                href={`${EtherscanUrlHelper.getTxUrl(
                  this.state.info.funds_transfer_tx,
                  this.props.networkId
                )}`}
                target="_blank"
                className="btn btn-iku  ml-auto mr-auto"
              >
                View transaction on ETHERSCAN.IO
              </a>
            </div>
          );
        } else {
          return (
            <div className="row">Transferring funds to proposal creator...</div>
          );
        }
      } else {
        if (this.state.info.finalized) {
          // Project didn't reach the goal
          return this.renderClaimSection();
        } else {
          return (
            <div className="row bad-news">
              Unfortunately the proposal didn't reach the goal, so in a few
              minutes you will be able to claim a refund. <br />
              Please check again later...
            </div>
          );
        }
      }
    }
  }

  renderMainRow() {
    if (!this.eth_price_usd || !this.state.ready) {
      return (
        <div className="row loading">
          <Loader size="small" />
        </div>
      );
    }

    const img = this.state.info.image
      ? this.state.info.image
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port !== 80 ? `:${window.location.port}` : ''
        }/assets/img/not-available.jpg`;

    return (
      <div className="row main-row">
        <div key="proposal-img" className="col-md-7">
          <div className="proposal-image-wrapper">
            <div
              style={{
                backgroundImage: `url('${img}')`,
              }}
              className="proposal-image"
            />
          </div>
        </div>
        <div key="funding-section" className="col-md-5">
          {this.renderFundingSection()}
        </div>
      </div>
    );
  }

  renderClaimSection() {
    if (!this.state.claim_status) {
      // Refund avaiable
      return (
        <div>
          <div className="row">
            The proposal didn't reach the goal, so if you contributed you can
            claim a refund and get your ETH back.
          </div>
          <div className="row">
            <button
              type="button"
              className="btn btn-iku btn-claim-refund btn-big"
              onClick={_ => this.claimRefund()}
            >
              Claim a refund
            </button>
          </div>
        </div>
      );
    } else if (this.state.claim_status === 'loading') {
      // Refund in progress

      return (
        <div className="row hold-tight">
          <p>Please wait while we claim your refund...</p>
          <Loader size="small" />
        </div>
      );
    } else {
      // Refund succesful

      return (
        <div className="row funded">
          <i className="fa fa-check" /> Your refund is on the way!
          <a
            href={`${EtherscanUrlHelper.getTxUrl(
              this.state.claim_status,
              this.props.networkId
            )}`}
            target="_blank"
            className="btn btn-iku"
          >
            See transaction details
          </a>
        </div>
      );
    }
  }

  renderFundingSection() {
    const { start_time, end_time } = this.state.info;

    let real_status = '';
    const now_unix_ts = Datetime.moment().unix();
    const funds_required = Currency.formatETH(
      this.state.funds_required.toString()
    );
    const amount_raised = Currency.formatETH(this.state.amount_raised);
    if (
      now_unix_ts > start_time &&
      now_unix_ts < end_time &&
      !this.state.info.finalized
    ) {
      real_status = 'Active';
      if (this.isProposalFunded()) {
        real_status = 'Funded';
      }
    } else if (now_unix_ts > end_time || this.state.info.finalized) {
      real_status = 'Ended';
    } else if (now_unix_ts < start_time) {
      real_status = 'Starting soon';
    }

    if (!this.eth_price_usd) {
      return <Loader size="small" />;
    }

    if (this.state.info.approved && this.state.info.start_time) {
      return (
        <div className="row">
          <div className="col-md-1" />
          <div className="col-md-10 proposal-data">
            <div className="row">
              <h6>Token</h6>
              {this.renderTokenNameAndSymbol()}
            </div>
            <div className="row amount-raised">
              <h6>Funding</h6>
              <h3>
                {amount_raised} ETH (${Currency.formatUSD(
                  this.state.amount_raised_usd.toString()
                )})
              </h3>
              <p>
                pledged of {funds_required} ETH goal (${Currency.formatUSD(
                  this.state.funds_required_usd.toString()
                )})
              </p>
            </div>

            <div className="row row-separator" />

            {this.getContentByStatus(real_status)}

            <div className="row row-separator" />

            {this.renderCTAs(real_status)}
          </div>
        </div>
      );
    } else if (this.state.info.approved) {
      return (
        <div className="row proposal-data">
          <div className="col-md-1" />
          <div className="col-md-10">
            <div className="row">{this.renderTokenNameAndSymbol()}</div>
            <div className="row">
              <h4>
                Duration: <b>{this.state.info.funding_process_duration} days</b>
              </h4>
            </div>

            <div className="row">
              <h4>
                Goal:{' '}
                <b>
                  ${Currency.formatUSD(this.state.funds_required_usd)} ({Currency.formatETH(
                    this.state.funds_required
                  )}{' '}
                  ETH)
                </b>
              </h4>
            </div>
            {this.renderApprovedMessage()}
            <div className="row hold-tight">
              <p>Migrating proposal to the Ethereum Blockchain...</p>
              <Loader size="small" />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-1" />
          <div className="col-md-10 proposal-data">
            <div className="row">{this.renderTokenNameAndSymbol()}</div>
            <div className="row">
              <h4>
                Duration: <b>{this.state.info.funding_process_duration} days</b>
              </h4>
            </div>

            <div className="row">
              <h4>
                Goal:{' '}
                <b>
                  ${Currency.formatUSD(this.state.funds_required_usd)} ({Currency.formatETH(
                    this.state.funds_required
                  )}{' '}
                  ETH)
                </b>
              </h4>
            </div>
            <div className="row waiting-approval">
              <button type="button" className="btn-disabled">
                Waiting For IKU Network Approval
              </button>
            </div>
            {this.renderPeerReviewHelper()}
          </div>
        </div>
      );
    }
  }

  renderTokenNameAndSymbol() {
    const { token_address, token_symbol, token_name } = this.state.info;

    if (token_address) {
      return (
        <h3>
          <a
            href={`${EtherscanUrlHelper.getAddressUrl(
              token_address,
              this.props.networkId
            )}`}
            target="_blank"
            className="token-name"
            title="View on etherscan.io"
          >
            {token_name} <span className="token-symbol">({token_symbol})</span>
          </a>
        </h3>
      );
    }

    return (
      <h3>
        <span className="token-name">
          {token_name} <span className="token-symbol">({token_symbol})</span>
        </span>
      </h3>
    );
  }

  renderApprovedMessage = () => (
    <div className="row row-alert">
      <div className="alert alert-success sidebar-alert">
        This proposal has been <br />approved by the IKU network
      </div>
      <div className="row row-separator" />
    </div>
  );

  renderTimeToStart = () => {
    const { start_time } = this.state.info;

    return (
      <h4>
        Starting in : <TimeCountdown date={start_time} />
      </h4>
    );
  };

  renderTimeLeft = () => {
    const { end_time } = this.state.info;

    const time_left = end_time * 1000 - Date.now();
    const one_day = 1000 * 60 * 60 * 24;
    if (time_left > one_day) {
      const days_left = Math.floor(time_left / (1000 * 60 * 60 * 24));
      return (
        <div className="time-left col-md-6">
          <span className="days-left-count">{days_left}</span>
          <span className="days-left-word">
            {`DAY${days_left > 0 ? 'S' : null}`} LEFT
          </span>
        </div>
      );
    } else {
      return (
        <div className="time-left col-md-6">
          <span className="days-left-count hours">
            <TimeCountdown date={end_time} />
          </span>
          <span className="days-left-word">HOURS LEFT</span>
        </div>
      );
    }
  };

  renderPeerReviewHelper() {
    if (!this.state.info.approved) {
      return (
        <div className="row">
          <div className="peer-review-helper">
            <p>
              This proposal needs more votes in order to be approved. Please
              take your time to get informed and{' '}
              <button className="btn-a interactive" onClick={this.showComments}>
                join the discussion!
              </button>
            </p>
          </div>
        </div>
      );
    }
  }

  render() {
    if (!this.state.info) {
      return (
        <div className="wrapper proposal">
          <div className="section section-white">
            <div className="container tim-container">
              <div className="row">
                <Loader />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const { info } = this.state;

    return (
      <div className="wrapper proposal">
        <div className="section section-white">
          <div className="container tim-container">
            <Title align="center">{info.name}</Title>
            {this.renderMainRow()}
            <div className="row">
              <div className="col-md-9 horizontal-section">
                <h3 className="title">
                  <small>
                    Submitted by <b>{info.creator_name}</b> on{' '}
                    {this.formatDate()}
                  </small>
                </h3>
                <button
                  className="btn btn-share btn-facebook"
                  onClick={_ => this.share('facebook')}
                >
                  <i className="fa fa-facebook" /> Share
                </button>
                <button
                  className="btn btn-share btn-twitter"
                  onClick={_ => this.share('twitter')}
                >
                  <i className="fa fa-twitter" /> Tweet
                </button>
              </div>
              <div className="col-md-3">
                <div className="vote-wrapper">
                  <button
                    className="btn btn-share btn-vote"
                    onClick={_ => this.vote()}
                  >
                    <i className="fa fa-thumbs-up" /> VOTE
                  </button>

                  <span className="vote-count">{this.state.votes}</span>
                </div>
              </div>
            </div>
            <div className="row main-content">
              <div className="col-md-12 ml-auto mr-auto">
                <Tabs
                  selectedIndex={this.state.tabIndex}
                  onSelect={tabIndex => this.setState({ tabIndex })}
                  domRef={c => {
                    this.tabsRef = c;
                  }}
                >
                  <div className="tabs-wrapper">
                    <TabList>
                      <Tab>INFO</Tab>
                      <Tab>COMMENTS</Tab>
                      <Tab>UPDATES</Tab>
                      {this.isProposalFunded() ? <Tab>DATA</Tab> : null}
                    </TabList>
                  </div>
                  <TabPanel>
                    <ProposalInfo
                      info={info}
                      fundsRequired={{
                        usd: this.state.funds_required_usd,
                        eth: this.state.funds_required,
                      }}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ProposalComments
                      proposalId={this.state.info.id}
                      user={this.props.user}
                      web3={this.props.web3}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ProposalUpdates proposalId={this.state.info.id} />
                  </TabPanel>
                  {this.isProposalFunded() ? (
                    <TabPanel>
                      <ProposalData
                        proposal={this.state.info}
                        isProposalOwner={this.isProposalOwner()}
                        user={this.props.user}
                        web3={this.props.web3}
                        accessingData={this.state.accessingData}
                        accessingLicense={this.state.accessingLicense}
                        requestAccessToData={_ => this.requestAccessToData()}
                        requestAccessToLicense={_ =>
                          this.requestAccessToLicense()
                        }
                        onUploadSuccess={(ipfs_hash, encryption_key) =>
                          this.onDataUploadSuccess(ipfs_hash, encryption_key)
                        }
                      />
                    </TabPanel>
                  ) : null}
                </Tabs>

                <div className="row social-row">
                  <div className="col-md-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ContributeModal
          show={this.state.show_contribute_modal}
          success={this.state.contributed}
          onClose={_ => this.closeContributeModal()}
          onContribute={amount => this.contribute(amount)}
          tokenName={this.state.info.token_name}
          tokenSymbol={this.state.info.token_symbol}
          rate={this.state.info.rate}
          etherPrice={this.eth_price_usd}
          loading={this.state.contribute_loading}
          contributionTx={this.state.contribution_tx}
          networkId={this.props.networkId}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
    address: state.user.address,
    web3: state.web3,
    networkId: state.network.networkId,
  }),
  dispatch => ({
    showNoWeb3BrowserModal: show =>
      dispatch(showNoWeb3BrowserModalAction(show)),
    showUnlockMetamaskModal: show =>
      dispatch(showUnlockMetamaskModalAction(show)),
    setAlert: message => dispatch(setGlobalAlertAction(message)),
    clearAlert: () => dispatch(clearGlobalAlertAction()),
  })
)(Proposal);
