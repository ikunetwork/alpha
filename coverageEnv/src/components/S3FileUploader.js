import React, { Component } from 'react';
import Loader from './Loader';
import apiRequest from '../utils/Fetch';

export default class S3FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.original_filename = '';
    this.generated_filename = '';
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const file = event.target.files[0];
    try {
      this.getSignedRequest(file);
    } catch (exception) {
      this.setState({ loading: false });
      this.props.onUploadError('Error: ', exception);
    }
  }

  getSignedRequest(file) {
    this.original_filename = file.name;
    this.generated_filename = this.generateFilename(file.name);

    apiRequest(
      '/api/sign-s3',
      {
        method: 'get',
      },
      {
        'file-name': this.generated_filename,
        'file-type': file.type,
      }
    )
      .then(response => {
        this.uploadFile(file, response.signedRequest, response.url);
      })
      .catch(error => {
        this.props.onUploadError('Could not get signed URL.');
        this.setState({ loading: false });
      });
  }

  generateFilename(name) {
    const tmp = name.split('.');
    return `${this.uuidv4()}.${tmp[tmp.length - 1]}`;
  }

  uuidv4 = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );

  uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.props.onUploadSuccess({
            url,
            original_filename: this.original_filename,
          });
        } else {
          this.props.onUploadError('Could not upload file');
        }
      }
      this.setState({ loading: false });
    };
    xhr.send(file);
  }

  render() {
    return (
      <div
        className={`s3FileUploaderWrapper ${
          this.props.className ? this.props.className : ''
        }`}
      >
        <div className="s3FileUploaderContent">
          {this.state.loading ? <Loader size="small" /> : this.props.children}
        </div>
        <input
          type="file"
          name={this.props.name}
          className="s3FileUploaderInput"
          onChange={e => this.onChange(e)}
        />
      </div>
    );
  }
}
