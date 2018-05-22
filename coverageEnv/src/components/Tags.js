import React from 'react';
import Tag from './Tag';

const Tags = props => {
  let input = null;
  const uniqueArray = arrArg =>
    arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  const addTag = () => {
    const { onAdded, tags, maxTags } = props;
    if (maxTags > 0) {
      if (tags.length >= maxTags) return;
    }
    const value = input.value.trim();
    const valArr = value.split(',');
    let trimmedArr = tags;
    valArr.forEach((val, index) => {
      const trimmedVal = val.replace(' ', '');
      if (trimmedVal.length !== 0) {
        trimmedArr.push(val);
      }
    });
    trimmedArr = uniqueArray(trimmedArr);
    onAdded(trimmedArr);
    input.value = '';
  };
  const removeTag = value => {
    const { onRemoved } = props;
    if (typeof onRemoved !== 'undefined') {
      onRemoved(value);
    }
  };

  const onInputKey = e => {
    const { tags } = props;
    switch (e.keyCode) {
      case Tags.KEYS.backspace:
        if (tags.length === 0 || !props.deleteOnKeyPress) return;

        if (input.value === '') {
          removeTag(props.tags[tags.length - 1]);
        }
        break;
      default:
        if (input.value === '') return;

        if (props.addKeys && props.addKeys.indexOf(e.keyCode) !== -1) {
          if (Tags.KEYS.enter !== e.keyCode) {
            e.preventDefault();
          }
          addTag();
        }
        break;
    }
  };

  const onInputChange = e => {
    const value = e.target.value.trim();
    if (typeof props.onInputChange !== 'undefined') {
      props.onInputChange(value);
    }
  };

  const { readOnly, removeTagIcon, placeholder, id, tags } = props;

  // -- Render tags
  const tagItems = tags.map((tag, v) => (
    <Tag
      key={`tag_${v.toString()}`}
      name={tag}
      readOnly={readOnly}
      removeTagIcon={removeTagIcon}
      onRemoveTag={t => removeTag(t)}
      size={props.size}
    />
  ));

  // -- Render the input field
  let tagInput = !props.readOnly ? (
    <div className="col-md-12 col-sm-6">
      <div className="form-group">
        <div className="tagInputContainer">
          <input
            type="text"
            className="form-control"
            autoComplete="off"
            aria-label={placeholder}
            placeholder={placeholder}
            onChange={onInputChange}
            onKeyDown={onInputKey}
            ref={el => {
              input = el;
            }}
          />
          <button
            type="button"
            className="addTagsButton btn btn-iku"
            onClick={addTag}
          >
            <i className="fa fa-plus-circle" />
            Add Tags
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const classNames = readOnly
    ? 'react-tags__container react-tags__container_readonly'
    : 'react-tags__container';
  if (props.disabled) tagInput = '';
  return (
    <div className={`react-tags ${props.size ? 'small' : ''}`} id={id}>
      {tagInput}
      {tagItems.length ? <div className={classNames}>{tagItems}</div> : null}
    </div>
  );
};

// -- Keyboard key map
Tags.KEYS = {
  enter: 13,
  tab: 9,
  spacebar: 32,
  backspace: 8,
  left: 37,
  right: 39,
};

export default Tags;
