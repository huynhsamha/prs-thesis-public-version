import React from 'react';

import '../assets/scss/horiz_loading.scss';

export default class HorizontalLoading extends React.Component {
  render() {
    return (
      <div hidden={!(this.props.visible || false)} style={this.props.style}>
        <div className="load-bar">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      </div>
    );
  }
}
