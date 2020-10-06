import React from 'react';

import * as apiService from '../../api';

import { withNamespaces } from 'react-i18next';
import ListSessions from './ListSessions';

class FinishedSessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: []
    };
  }

  componentWillMount() {
    this.getFinishedSessions();
  }

  getFinishedSessions() {
    apiService
      .getCompleteSessions()
      .then(session => {
        console.log(session);
        this.setState({
          sessions: session.data || []
        });
      })
      .catch(console.log);
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <h4>{t('title.list.session.finished')}</h4>
        <br />
        <ListSessions sessions={this.state.sessions} />
      </>
    );
  }
}

export default withNamespaces()(FinishedSessions);
