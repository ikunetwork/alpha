import React, { Component } from 'react';
import Currency from '../utils/Currency';

export default class ProposalInfo extends Component {
  renderAttachments() {
    if (!this.props.info || !this.props.info.attachments) {
      return null;
    }
    const attachments = JSON.parse(this.props.info.attachments);
    if (attachments.length) {
      return (
        <div>
          <h4>Attachments</h4>
          <ul className="proposal-attachments">
            {attachments.map((item, i) => (
              <li key={`item-${i.toString()}`}>
                <a href={item.url} target="_blank" className="attachment">
                  <i className="fa fa-file" /> {item.original_filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  }

  render() {
    const funds_required = Currency.formatETH(
      this.props.fundsRequired.eth.toString()
    );

    const funds_required_usd = Currency.formatUSD(
      this.props.fundsRequired.usd.toString()
    );

    return (
      <div className="article-content">
        <h4>Principal Investigator</h4>
        <p>
          {this.props.info.investigator_name},{' '}
          {this.props.info.investigator_location}
        </p>
        <h4>Proposition Thesis</h4>
        <p>{this.props.info.thesis}</p>

        <h4>Current Stage</h4>
        <p>{this.props.info.current_stage}</p>

        <h4>Empirical Data</h4>
        <p>{this.props.info.empirical_data}</p>

        <h4>Anecdotal Data</h4>
        <p>{this.props.info.anecdotal_data}</p>

        <h4>Scientific Justification</h4>
        <p>{this.props.info.scientific_justification}</p>

        <h4>Observation</h4>
        <p>{this.props.info.observations}</p>

        <h4>Rare Disease</h4>
        <p>{this.props.info.rare_disease ? 'YES' : 'NO'}</p>

        <h4>Funds Required</h4>
        <p>
          {funds_required} ETH - ${funds_required_usd}
        </p>

        <h4>Socioeconomic Implication</h4>
        <p>{this.props.info.socioeconomic_implication}</p>

        {this.renderAttachments()}
      </div>
    );
  }
}
