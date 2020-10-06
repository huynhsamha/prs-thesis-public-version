import React from 'react';
import { withNamespaces } from 'react-i18next';

import { Form, Input, Tooltip, Icon, Button } from '../../antd';
import { confirmWarning } from '../../utils/customAlert';

import * as api from '../../api';

class FormEditor extends React.Component {
  render() {
    return <div></div>;
  }
}

export default withNamespaces()(
  Form.create({ name: 'create_editor' })(FormEditor)
);
