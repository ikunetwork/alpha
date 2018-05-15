import React, { Component } from 'react';
import Contract from 'truffle-contract';
import IkuToken from '../../build/contracts/IkuToken.json';

export default class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenBalance: 0,
      tokenSymbol: 'IKU',
      tokenDecimals: 18,
    };
  }

  componentWillMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const token = Contract(IkuToken);
    token.setProvider(this.props.web3.currentProvider);

    // Declaring this for later so we can chain functions.
    let tokenInstance;

    token
      .deployed()
      .then(instance => {
        tokenInstance = instance;
        return tokenInstance.balanceOf.call(this.props.address);
      })
      .then(result => {
        const balance = result
          .dividedBy(10 ** this.state.tokenDecimals)
          .toFormat(0);

        // Update state with the result.
        this.setState({ tokenBalance: balance });
        return tokenInstance.symbol.call();
      })
      .catch(e => {
        console.log('THERE WAS AN ERROR: ', e);
      });
  }

  render() {
    return (
      <div className="wallet">
        {this.state.tokenBalance} {this.state.tokenSymbol}
      </div>
    );
  }
}
