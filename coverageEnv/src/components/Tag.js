import React from 'react';

const Tag = props => {
  const onRemoveClick = e => {
    props.onRemoveTag(props.name);
  };
  const removeIcon = !props.readOnly
    ? props.removeTagIcon || String.fromCharCode(215)
    : null;
  return (
    <button
      onClick={onRemoveClick}
      className={`btn btn-danger ${props.size ? 'small-tag' : ''}`}
    >
      <div className="mainTagContent">{props.name}</div>
      {removeIcon}
    </button>
  );
};

export default Tag;
