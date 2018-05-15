import React, { Component } from 'react';
import Disqus from 'disqus-react';

export default class DisqusComments extends Component {
  constructor(props) {
    super(props);
    this.disqusShortname = 'alpha-iku-network';
    this.disqusConfig = {
      url: props.currentUrl,
      identifier: `rt_${props.id}`,
      title: props.title,
    };
  }

  render() {
    return (
      <div>
        <div className="row col-md-12">
          <h3 className="text-center">
            <Disqus.CommentCount
              shortname={this.disqusShortname}
              config={this.disqusConfig}
            >
              Comments
            </Disqus.CommentCount>
          </h3>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Disqus.DiscussionEmbed
              shortname={this.disqusShortname}
              config={this.disqusConfig}
            />
          </div>
        </div>
      </div>
    );
  }
}
