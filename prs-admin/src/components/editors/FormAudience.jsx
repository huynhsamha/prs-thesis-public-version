import React from 'react';
import { withNamespaces } from 'react-i18next';

import { Form, Input, Button } from '../../antd';
import {
  confirmWarning,
  alertSuccess,
  alertError
} from '../../utils/customAlert';

import * as api from '../../api';

class FormAudience extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        const { email } = values;
        confirmWarning(`Bạn xác nhận thêm audience này?`).then(ok => {
          if (!ok) return;
          api
            .createAudience({ email })
            .then(data => {
              alertSuccess('Tài khoản đã được thêm thành công').then(() => {
                window.location.href = '/audiences';
              });
            })
            .catch(err => {
              console.log(err);
              alertError('Đã xảy ra lỗi');
            });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        lg: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        lg: { span: 8 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 6
        },
        lg: {
          span: 8,
          offset: 2
        }
      }
    };

    return (
      <div className="mt-3">
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="E-mail">
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
                {
                  required: true,
                  message: 'Please input an E-mail!'
                }
              ]
            })(<Input />)}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Add Audience
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default withNamespaces()(
  Form.create({ name: 'create_editor' })(FormAudience)
);
