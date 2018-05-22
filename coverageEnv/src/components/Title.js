import React from 'react';

const Title = props => (
  <div className="row">
    <div
      className={`col-md-10  ${
        props.align === 'center' ? 'ml-auto mr-auto text-center' : ''
      }`}
    >
      <h2 className="title">{props.children}</h2>
    </div>
  </div>
);

export default Title;
