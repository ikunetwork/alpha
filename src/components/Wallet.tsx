import * as React from "react";
import * as Contract from "truffle-contract";
import { IkuToken } from "../../contracts";

interface WalletProps {
  web3: any;
  address: string;
  sayHi: () => string;
}

interface WalletState {
  tokenBalance: number,
  tokenSymbol: string, 
  tokenDecimals: number
}

export default class Wallet extends React.Component<WalletProps, WalletState, {}> {
  constructor(props: WalletProps) {
    super(props);

    this.state = { tokenBalance: 0, tokenSymbol: "IKU", tokenDecimals: 18 };
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
        console.log("THERE WAS AN ERROR: ", e);
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
