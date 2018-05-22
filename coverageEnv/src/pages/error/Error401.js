import React from 'react';

const Error401 = props => (
  <div className="wrapper">
    <div className="error-401-page">
      <div className="section section-grey">
        <div className="container col-md-6 proposal-form">
          <div className="row">
            <div className="ml-auto mr-auto text-center title">
              <h2>Not Authorized</h2>
            </div>
            <p>
              You are not authorized to access this page <br />
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Error401;
