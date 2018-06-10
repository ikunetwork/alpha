import React from 'react';
import EtherscanUrlHelper from '../../../utils/EtherscanUrlHelper';

function UserInfoField({ field, title, onChange }) {
  return (
    <div className="row">
      <p>{title}</p>
      <div className="col-md-12 col-sm-6">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name={title}
            value={field}
            placeholder="Click to edit this field"
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

const getFieldTitle = id =>
  id
    .split('_')
    .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ');

export default function UserInfo({
  user,
  onChange,
  handleSubmit,
  fields,
  address,
  networkId,
}) {
  return (
    <div className="col-md-12 col-sm-12">
      <p>Address: </p>
      <a
        href={`${EtherscanUrlHelper.getAddressUrl(address, networkId)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="address token-name"
        title="View on etherscan.io"
      >
        {address}
      </a>
      <form onSubmit={handleSubmit}>
        {fields
          .map((id, i) =>
            React.createElement(UserInfoField, {
              key: `user-info-field-${id}`,
              onChange: e => onChange(e, id),
              title: getFieldTitle(id),
              field: user[id],
            })
          )
          .concat(
            <div className="row" key="user-info-submit">
              <div className="text-center title">
                <input
                  type="submit"
                  value="Save"
                  key="user-info-submit"
                  className="btn btn-iku btn-big"
                />
              </div>
            </div>
          )}
      </form>
    </div>
  );
}
