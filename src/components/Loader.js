import React, { Component } from 'react';

export default class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  renderSmall = () => (
    <div className="small_preloader__icn">
      <div className="small_preloader__cut">
        <div className="small_preloader__donut" />
      </div>
    </div>
  );

  renderNormal = () => <div className="loader" />;

  render() {
    return this.props.size && this.props.size === 'small'
      ? this.renderSmall()
      : this.renderNormal();
  }
}
