import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Tags from './Tags';

class ResearchTargetCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { item } = this.props;

    /*
    let desc = item.description ? item.description.substring(0, 350) : '';
    if (this.props.type === 'proposal') {
      desc = item['Scientific Justification']
        ? item['Scientific Justification'].substring(0, 350)
        : '';
    }
    

    desc = `${desc.replace(/<\/?[^>]+(>|$)/g, '')}...`;
    */
    let name = item.Name ? item.Name : item.name;
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const img = item.picture
      ? item.picture
      : `${window.location.protocol}//${window.location.hostname}${
          window.location.port !== 80 ? `:${window.location.port}` : ''
        }/assets/img/not-available.jpg`;

    return (
      <div className="card card-blog">
        <div className="card-image" style={{ background: `url("${img}")` }}>
          <Link
            to={{
              pathname: `/${
                this.props.type === 'proposal' ? 'proposal' : 'research-target'
              }/${this.props.item.id}`,
              state: this.props.item,
            }}
            className="card-image-link"
          >
            {''}
          </Link>
        </div>
        <div className="card-body text-center">
          <h4 className="card-title">{name}</h4>
          <div className="card-description row">
            <div className="col-md-7">
              <h5>Est. $ Required:</h5>
              <p>{item.est_required || 'Unknown'}</p>
            </div>
            <div className="col-md-5">
              <h5>Status:</h5>
              <p>{item.current_status || 'Unknown'}</p>
            </div>
          </div>
          <div className="card-footer">
            <div className="row">
              <Tags
                tags={
                  item.tags && item.tags !== ''
                    ? item.tags.split(',').slice(0, 2)
                    : []
                }
                disabled={true}
                placeholder=""
                readOnly={true}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResearchTargetCard;
