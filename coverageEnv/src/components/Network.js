import React, { PureComponent } from 'react';
import Web3Helper from '../utils/Web3Helper';

export default class Network extends PureComponent {
  render() {
    if (!this.props.networkId) {
      return null;
    }

    return (
      <div className="network">
        <i className="fa fa-sitemap" />{' '}
        {Web3Helper.getNetwork(this.props.networkId)}
      </div>
    );
  }
}
