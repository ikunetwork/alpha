import fetch from 'cross-fetch';

const apiRequest = (url, fetchOpts, params) => {
  let tmp_url = url;
  if (!fetchOpts.external) {
    if (window.location.hostname === 'localhost') {
      tmp_url = `http://localhost:8080${url}`;
    } else {
      tmp_url = `${window.location.protocol}//${
        window.location.hostname
      }${url}`;
    }
  }

  let _url = tmp_url;
  const _fetchOpts = fetchOpts;

  if (params != null) {
    const paramsStr = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join('&');
    _url += `?${paramsStr}`;
  }

  if (_fetchOpts.method) {
    _fetchOpts.method = _fetchOpts.method.toUpperCase();
  }
  if (
    _fetchOpts.method === 'POST' ||
    _fetchOpts.method === 'PUT' ||
    _fetchOpts.method === 'PATCH'
  ) {
    _fetchOpts.body = JSON.stringify(_fetchOpts.body);
    _fetchOpts.mode = 'cors';
  }

  _fetchOpts.headers = _fetchOpts.headers || {};

  if (_fetchOpts.jwt_auth) {
    _fetchOpts.headers.Authorization = `JWT ${_fetchOpts.jwt_auth}`;
  }

  _fetchOpts.headers = {
    ..._fetchOpts.headers,
    'Content-Type': 'application/json',
  };

  return fetch(_url, _fetchOpts)
    .then(res => {
      const body = res.json();
      if (res.status >= 200 && res.status < 300) {
        return body;
      } else {
        return body.then(errorObject => {
          const _errorObject = errorObject;
          _errorObject.status = res.status;
          _errorObject.url = _url;
          throw _errorObject;
        });
      }
    })
    .catch(e => {
      console.log(_url, _fetchOpts, e);
      throw e;
    });
};

export default apiRequest;
