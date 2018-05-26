import * as React from "react";
import * as Contract from "truffle-contract";
import IkuTokenHelper from '../utils/IkuTokenHelper';

interface Props {
  web3: any;
  address: string;
  sayHi: () => string;
}

interface State {
  tokenBalance: number,
  tokenSymbol: string, 
  tokenDecimals: number
}

export default class Wallet extends React.Component<Props, State, {}> {
  constructor(props: Props) {
    super(props);

    this.state = { tokenBalance: 0, tokenSymbol: "IKU", tokenDecimals: 18 };
  }

  componentWillMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    IkuTokenHelper.getBalance(this.props.web3.currentProvider, this.props.address)
      .then(result => {
        const balance = result
          .dividedBy(10 ** this.state.tokenDecimals)
          .toFormat(0);
          this.setState({ tokenBalance: balance });
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
