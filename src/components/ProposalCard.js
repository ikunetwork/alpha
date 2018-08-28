import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ProposalCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { item } = this.props;

    const desc = item.scientific_justification
      ? item.scientific_justification.substring(0, 250)
      : '';

    const img = item.image
      ? item.image
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port !== 80 ? `:${window.location.port}` : ''
        }/assets/img/not-available.jpg`;

    return (
      <div className="card card-blog">
        <div className="card-image" style={{ background: `url("${img}")` }}>
          <Link
            to={{
              pathname: `/proposal/${this.props.item.id}`,
              state: this.props.item,
            }}
            className="card-image-link"
          >
            {''}
          </Link>
        </div>
        <div className="card-body text-center">
          <h4 className="card-title">{item.name}</h4>
          <div className="card-description">
            {desc}
            ...
          </div>
          <div className="card-footer" />
        </div>
      </div>
    );
  }
}

export default ProposalCard;
