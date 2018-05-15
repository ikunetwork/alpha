import React, { PureComponent } from 'react';
import EthereumBlockies from 'ethereum-blockies';

export default class Blocky extends PureComponent {
  constructor(props) {
    super(props);
    let options = {
      seed: props.address,
    };

    if (!props.random) {
      options = {
        ...options,
        color: '#1664bb',
        bgcolor: '#ffffff',
        spotcolor: '#0000ff',
      };
    }

    if (props.size === 'big') {
      options = {
        ...options,
        size: 16,
        scale: 32,
      };
    } else {
      options = {
        ...options,
        size: 8,
        scale: 16,
      };
    }

    this.blocky = EthereumBlockies.create(options).toDataURL();
  }

  render() {
    return (
      <div
        className={`blocky ${this.props.className ? this.props.className : ''}`}
        style={{ backgroundImage: `url(${this.blocky})` }}
      />
    );
  }
}
