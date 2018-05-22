import React, { Component } from 'react';
import { connect } from 'react-redux';
import Contract from 'truffle-contract';
import Currency from '../../utils/Currency';
import IkuTokenHelper from '../../utils/IkuTokenHelper';
import Error401 from '../../pages/error/Error401';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import ResearchSpecificToken from '../../../build/contracts/ResearchSpecificToken.json';

// ui
import { editUserInfoAction } from '../../redux/modules/user';
import { UserInfo, Wallet } from './ui';

import './Account.css';

// adding keys here will create an editable field
const EDITABLE_FIELDS = [
  'first_name',
  'last_name',
  'username',
  'email',
  'organization',
];

const getBigNumber = Currency.getTokenBalance(18);

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rstBalances: [],
      fetchingRstBalances: false,
      ethBalance: null,
      ethBalanceUsd: null,
      ikuBalance: null,
      unsavedUserInfo: props.user,
    };
  }

  componentWillMount() {
    if (this.props.address) {
      this.getBalances(this.props.address);
    }
    if (this.props.proposals.length) {
      this.fetchRSTContracts();
    }
  }

  componentWillReceiveProps(nextProps) {
    // if proposals weren't ready onMount
    if (
      !this.state.fetchingRstBalances &&
      !this.state.rstBalances.length &&
      this.props.proposals.length
    ) {
      this.fetchRSTContracts();
    }

    if (!this.props.address && nextProps.address) {
      this.getBalances(nextProps.address);
    }
  }

  getBalances(address) {
    this.getEthBalance(address);
    this.getIkuBalance(address).then(balance => this.setIkuBalance(balance));
  }

  getEthBalance(address) {
    if (address) {
      this.props.web3.eth.getBalance(address, (error, bigNumber) => {
        this.setState({
          ethBalance: Currency.formatETH(Currency.weiToETH(bigNumber)),
        });

        Currency.getEtherPriceInUSD()
          .then(eth_price_usd => {
            const balance = Currency.ethToUSD(
              this.state.ethBalance,
              eth_price_usd
            ).toNumber();
            this.setState({
              ethBalanceUsd: Currency.formatUSD(balance),
            });
          })
          .catch(e => {
            console.log('Error getting ETH price in USD');
          });

        if (error) {
          console.log('Error retrieving ether balance.', error);
        }
      });
    }
  }

  getIkuBalance(address) {
    return IkuTokenHelper.getBalance(this.props.web3.currentProvider, address);
  }

  setIkuBalance(balance) {
    const ikuBalance = getBigNumber(balance);
    this.setState({ ikuBalance });
  }

  getContractInstance(token_address) {
    const contract = Contract(ResearchSpecificToken);
    contract.setProvider(this.props.web3.currentProvider);
    return contract.at(token_address);
  }

  getRSTContracts(proposals) {
    return proposals.map(proposal => {
      const { token_address } = proposal;
      return this.getContractInstance(token_address);
    });
  }

  getNewFields() {
    return EDITABLE_FIELDS.reduce(
      (o, field) => ({
        [field]: this.state.unsavedUserInfo[field],
        ...o,
      }),
      {}
    );
  }

  fetchRSTContracts() {
    this.setState({ fetchingRstBalances: true });
    this.getRSTContracts(
      this.props.proposals.filter(p => p.token_address)
    ).forEach(contract => this.queryRSTBalance(contract));
  }

  handleUserInfoChange = (e, id) => {
    const { value } = e.target;
    const unsavedUserInfo = {
      ...this.state.unsavedUserInfo,
      [id]: value,
    };
    this.setState({ unsavedUserInfo });
  };

  handleUserInfoSubmit = e => {
    e.preventDefault();
    this.props.editUserInfo(this.getNewFields());
  };

  addRSTBalance(token_address, bigNumber) {
    const matchesAddress = proposal => proposal.token_address === token_address;
    const proposalData = this.props.proposals.find(p => matchesAddress(p));

    const { token_symbol, decimals } = proposalData;
    const balance = Currency.getTokenBalance(decimals)(bigNumber);

    const matchesSymbol = c => c.token_symbol === token_symbol;
    const rstBalances = this.state.rstBalances
      .filter(c => !matchesSymbol(c))
      .concat({ token_symbol, balance, token_address });

    this.setState({
      rstBalances,
      fetchingRstBalances: false,
    });
  }

  queryRSTBalance(contractInstance) {
    return contractInstance.balanceOf
      .call(this.props.address)
      .then(result => this.addRSTBalance(contractInstance.address, result));
  }

  renderContent = () =>
    this.state.fetchingRstBalances ? (
      <Loader />
    ) : (
      <div className="section">
        <div className="container tim-container">
          <div className="account col-md-12 col-sm-12">
            <Title align="center">Your account</Title>
            <div className="row">
              <div className="col-md-5 col-sm-12">
                <Wallet
                  ikuBalance={this.state.ikuBalance}
                  ethBalance={this.state.ethBalance}
                  ethBalanceUsd={this.state.ethBalanceUsd}
                  rstBalances={this.state.rstBalances}
                />
              </div>
              <div className="col-md-7 col-sm-12">
                <div className="form-wrapper">
                  <UserInfo
                    address={this.props.address}
                    networkId={this.props.networkId}
                    fields={EDITABLE_FIELDS}
                    user={this.state.unsavedUserInfo}
                    onChange={this.handleUserInfoChange}
                    handleSubmit={this.handleUserInfoSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  render() {
    return (
      <div className="wrapper">
        {this.props.loggedIn ? this.renderContent() : <Error401 />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.user.editingInfo,
    error: state.user.editError,
    proposals: state.proposals.proposals,
  }),
  dispatch => ({
    editUserInfo: fields => dispatch(editUserInfoAction(fields)),
  })
)(Account);
