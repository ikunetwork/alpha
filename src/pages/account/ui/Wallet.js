import React from 'react';
import Blocky from '../../../components/Blocky';

function WalletCell({ token_symbol, balance, token_address }) {
  return balance ? (
    <li key={`walletcell-${token_symbol}`}>
      <Blocky random={true} address={token_address} size="big" />{' '}
      <h5>{`${balance} ${token_symbol}`}</h5>
    </li>
  ) : null;
}

export default function Wallet(props) {
  const {
    ikuAddress,
    ikuBalance,
    ethBalance,
    ethBalanceUsd,
    rstBalances,
  } = props;
  return (
    <div className="col-md-12 col-sm-12">
      <div className="eth-balance row">
        <div className="col-md-4 col-sm-6">
          <img
            className="eth-logo"
            alt="Ethereum logo"
            src="../../assets/img/ethereum-logo.png"
          />
        </div>
        <div className="col-md-8 col-sm-6">
          <h4>{ethBalance} ETH</h4>
          <h5>$ {ethBalanceUsd} USD</h5>
        </div>
      </div>
      <h5 className="subtitle">Your tokens</h5>
      <ul className="account-wallet">
        {[{ token_symbol: 'IKU', balance: ikuBalance, token: ikuAddress }]
          .concat(rstBalances)
          .map(token => WalletCell(token))}
      </ul>
    </div>
  );
}
