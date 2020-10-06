import React from 'react';

import * as apiService from '../../api';

import { withNamespaces } from 'react-i18next';
import TableEditors from './TableEditors';

class LoadEditors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.getAllEditor();
  }

  getAllEditor() {
    apiService
      .getAllEditor()
      .then(data => {
        console.log(data);
        this.setState({
          data: data || []
        });
      })
      .catch(console.log);
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <h4>Danh sách các Editors trong hệ thống</h4>
        <br />
        <TableEditors data={this.state.data} />
      </>
    );
  }
}

export default withNamespaces()(LoadEditors);
