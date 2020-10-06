import React from 'react';
import Loadable from 'react-loadable';

import Loading from '../layouts/Loading';

export const LoadableComponent = Loadable({
  loader: () => import('../layouts/Converter'),
  loading: Loading
});

class Converter extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <LoadableComponent />
    );
  }
}

export default Converter;
