import BigNumber from 'bignumber.js';
import apiRequest from './Fetch';

export default class Currency {
  static getEtherPriceInUSD() {
    return new Promise((resolve, reject) => {
      apiRequest(
        'https://min-api.cryptocompare.com/data/price',
        {
          method: 'post',
          external: true,
        },
        {
          fsym: 'ETH',
          tsyms: 'USD',
          sign: true,
        }
      )
        .then(data => {
          resolve(data.USD);
        })
        .catch(e => {
          if (e.code && e.code === 'EUNAVAILABLE') {
            resolve(1000);
          } else {
            reject({ message: e.message });
          }
        });
    });
  }

  static weiToUSD(wei, eth_price_USD) {
    const eth = Currency.weiToETH(wei);
    return eth.times(eth_price_USD);
  }

  static weiToETH(wei) {
    return new BigNumber(web3.fromWei(parseFloat(wei)));
  }

  static ethToWei(eth) {
    return new BigNumber(web3.toWei(parseFloat(eth), 'ether'));
  }

  static ethToUSD(eth, eth_price_USD) {
    const val = parseFloat(eth) * parseFloat(eth_price_USD);
    return new BigNumber(val.toString());
  }

  static usdToETH(usd, eth_price_USD) {
    const val = parseFloat(usd) / parseFloat(eth_price_USD);
    return new BigNumber(String(val));
  }

  static usdToWei(usd, eth_price_USD) {
    const eth = parseFloat(usd) / parseFloat(eth_price_USD);
    const wei = web3.toWei(eth, 'ether');
    return new BigNumber(wei.toString());
  }

  static toFloat(number) {
    return new BigNumber(parseFloat(number).toString());
  }

  static formatETH(number) {
    return new BigNumber(number.toString()).toFormat(3);
  }

  static formatUSD(number) {
    return new BigNumber(number.toString()).toFormat(2);
  }

  static formatTokens(number) {
    return new BigNumber(number.toString()).toFormat(3);
  }

  static getTokenBalance(dec) {
    return bigNum => bigNum.dividedBy(10 ** dec).toFormat(0);
  }
}
