import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import Title from '../../components/Title';
import './Faq.css';

class Faq extends PureComponent {
  renderContent() {
    return (
      <div id="acordeon">
        <div id="accordion" role="tablist" aria-multiselectable="true">
          <div className="card no-transition">
            {this.props.questions.map((q, i) => (
              <div key={`faq-${i.toString()}`}>
                <div
                  className="card-header card-collapse"
                  role="tab"
                  id="headingOne"
                >
                  <h5 className="mb-0 panel-title">
                    <a
                      className="collapsed"
                      data-toggle="collapse"
                      data-parent="#accordion"
                      href={`#collapse-${i}`}
                      aria-expanded="false"
                      aria-controls={`collapse-${i}`}
                    >
                      {q.fields.Question}
                      <i className="nc-icon nc-minimal-down" />
                    </a>
                  </h5>
                </div>
                <div
                  id={`collapse-${i}`}
                  className="collapse"
                  role="tabpanel"
                  aria-labelledby="headingOne"
                >
                  <div className="card-body">{q.fields.Answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderLoader = () => (
    <div className="row">
      <Loader />
    </div>
  );

  render() {
    return (
      <div className="wrapper">
        <div className="faq-page">
          <div className="section section-grey">
            <div className="container">
              <Title align="center">F.A.Q.</Title>
              <div className="row">
                <div className="col-md-8 ml-auto mr-auto">
                  {(this.props.loading && this.renderLoader()) ||
                    this.renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    questions: state.faq.faq,
    loading: state.faq.loading,
  }),
  dispatch => ({})
)(Faq);
