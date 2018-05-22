export default class EtherscanUrlHelper {
  static getTxUrl(tx_id, network_id) {
    const subdomain = network_id === '3' ? 'ropsten.' : '';
    return `https://${subdomain}etherscan.io/tx/${tx_id}`;
  }

  static getAddressUrl(address, network_id) {
    const subdomain = network_id === '3' ? 'ropsten.' : '';
    return `https://${subdomain}etherscan.io/address/${address}`;
  }
}
