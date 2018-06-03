import React from 'react';

export default function Alert(props) {
  return props.alert ? (
    <div
      className={`global-alert-container${props.alert ? ' active-alert' : ''}`}
    >
      <p className="global-alert-text">{props.alert}</p>
    </div>
  ) : null;
}