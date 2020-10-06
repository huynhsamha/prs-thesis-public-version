import React from 'react';

import * as apiService from '../../api';

import TableAudiences from './TableAudiences';

class LoadAudiences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    const { ban } = this.props;
    if (ban) {
      this.getBanAudiences();
    } else {
      this.getAllAudiences();
    }
  }

  getAllAudiences() {
    apiService
      .getActiveAudience()
      .then(data => {
        console.log(data);
        this.setState({
          data: data || []
        });
      })
      .catch(console.log);
  }

  getBanAudiences() {
    apiService
      .getBanAudience()
      .then(data => {
        console.log(data);
        this.setState({
          data: data || []
        });
      })
      .catch(console.log);
  }

  render() {
    const { ban } = this.props;
    let title = '';
    if (ban) {
      title = 'Danh sách các Audiences đã chặn';
    } else {
      title = 'Danh sách các Audiences trong hệ thống';
    }

    return (
      <>
        <h4>{title}</h4>
        <br />
        <TableAudiences ban={ban} data={this.state.data} />
      </>
    );
  }
}

export default LoadAudiences;
