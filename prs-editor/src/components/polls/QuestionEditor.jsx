import React from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Button,
  Radio,
  Icon,
  Steps,
  Input,
  Form,
  Checkbox,
  Tag
} from '../../antd';
import { labelColors } from '../../utils/constant';

const { Step } = Steps;
const { Search } = Input;

class QuestionEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '', // single | multiple | input
      title: '',
      options: [],
      selectedOption: 0,
      checkedOptions: [],
      optionId: 0,
      textAnswers: [],
      showInputAddText: false,
      inputAddText: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const q = nextProps.question;
    this.setState({
      type: q.type || '', // single | multiple | input
      title: q.title || '',
      options: q.choices || [],
      selectedOption:
        ((q.choices || []).filter(u => u.isCorrect)[0] || {}).id || 0,
      checkedOptions:
        (q.choices || []).filter(u => u.isCorrect).map(u => u.id) || [],
      optionId: Math.max((q.choices || []).map(u => u.id)) || 0,
      textAnswers: (q.choices || []).map(u => u.value),
      showInputAddText: false,
      inputAddText: '',
      inputAddOption: ''
    });
  }

  onChangeType = e => {
    this.setState({ type: e.target.value });
  };

  onClickSave = () => {
    const newData = {
      ...this.props.question,
      title: this.state.title || this.props.question.title,
      type: this.state.type || this.props.question.type
    };
    if (newData.type === 'single') {
      newData.choices = this.state.options.map(u => {
        if (u.id === this.state.selectedOption) u.isCorrect = true;
        else u.isCorrect = false;
        return u;
      });
    } else if (newData.type === 'multiple') {
      newData.choices = this.state.options.map(u => {
        if (this.state.checkedOptions.indexOf(u.id) > -1) u.isCorrect = true;
        else u.isCorrect = false;
        return u;
      });
    } else if (newData.type === 'text') {
      newData.choices = this.state.textAnswers.map((u, i) => {
        return {
          id: i,
          value: u
        };
      });
    }
    this.props.notifyUpdateQuestion(newData);
    this.onClose();
  };

  onClose = () => {
    this.setState({
      type: '',
      title: ''
    });
    this.props.onCloseDrawerEditQuestion();
  };

  isQuiz = () => {
    return this.props.surveyOrQuiz === 'quiz';
  };

  onChangeOption = e => {
    this.setState({
      selectedOption: e.target.value
    });
  };

  onChangeCheckBox = checkedValues => {
    this.setState({
      checkedOptions: checkedValues
    });
  };

  onClickBtnAddOption = () => {
    if (this.state.inputAddOption === '') return;
    this.state.options.push({
      id: this.state.optionId + 1,
      value: this.state.inputAddOption
    });
    this.setState({
      options: this.state.options,
      optionId: this.state.optionId + 1,
      inputAddOption: ''
    });
  };

  handleAddTextInputConfirm = () => {
    const { inputAddText } = this.state;
    let { textAnswers } = this.state;
    if (inputAddText && textAnswers.indexOf(inputAddText) === -1) {
      textAnswers = [...textAnswers, inputAddText];
    }
    this.setState({
      textAnswers,
      showInputAddText: false,
      inputAddText: ''
    });
  };

  onClickRemoveOption = o => {
    this.setState({
      options: this.state.options.filter(u => u.id !== o.id)
    });
  };

  render() {
    const {
      question,
      pollTitle,
      onCloseDrawerEditQuestion,
      surveyOrQuiz,
      t
    } = this.props;

    return (
      <>
        <Form layout="vertical" hideRequiredMark style={{ paddingBottom: 80 }}>
          <h6>
            <Tag color={labelColors[surveyOrQuiz]}>{t(surveyOrQuiz)}</Tag>{' '}
            {pollTitle}
          </h6>
          <Steps direction="vertical">
            <Step
              title={<h6>Chọn loại câu hỏi</h6>}
              icon={<Icon type="file-unknown" />}
              className="mt-3"
              status="finish"
              description={
                <div style={{ marginTop: 15 }}>
                  <Radio.Group
                    buttonStyle="solid"
                    size="large"
                    value={this.state.type}
                    onChange={this.onChangeType}
                  >
                    <Radio.Button value="single">
                      {t('single-choice')}
                    </Radio.Button>
                    <Radio.Button value="multiple">
                      {t('multiple-choices')}
                    </Radio.Button>
                    <Radio.Button value="text">{t('input-text')}</Radio.Button>
                  </Radio.Group>
                </div>
              }
            />
            <Step
              title={<h6>Nội dung câu hỏi</h6>}
              icon={<Icon type="font-colors" />}
              className="mt-3"
              status="finish"
              description={
                <div style={{ marginTop: 15 }}>
                  <Input
                    defaultValue={question.title}
                    value={this.state.title}
                    onChange={e => {
                      this.setState({ title: e.target.value });
                    }}
                  />
                </div>
              }
            />
            {this.state.type === 'single' && (
              <Step
                title={<h6>Danh sách các lựa chọn</h6>}
                status="finish"
                icon={<Icon type="appstore" />}
                className="mt-3"
                description={
                  <div style={{ marginTop: 1 }}>
                    {this.isQuiz() && <p>Chọn vào các ô là đáp án đúng</p>}
                    <Radio.Group
                      onChange={this.onChangeOption}
                      value={this.state.selectedOption}
                      style={{ marginLeft: 10 }}
                    >
                      {this.state.options.map(o => {
                        return (
                          <Radio
                            key={o.id}
                            style={{
                              display: 'block',
                              height: '30px',
                              lineHeight: '30px'
                            }}
                            value={o.id}
                          >
                            {o.value}
                            <Icon
                              type="close-circle"
                              style={{ marginLeft: 20, fontSize: 15 }}
                              onClick={() => this.onClickRemoveOption(o)}
                            />
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                    <Search
                      enterButton="Thêm lựa chọn"
                      onSearch={this.onClickBtnAddOption}
                      style={{ marginTop: 5 }}
                      value={this.state.inputAddOption}
                      onChange={e => {
                        this.setState({ inputAddOption: e.target.value });
                      }}
                    />
                  </div>
                }
              />
            )}
            {this.state.type === 'multiple' && (
              <Step
                title={<h6>Danh sách các lựa chọn</h6>}
                icon={<Icon type="appstore" />}
                status="finish"
                className="mt-3"
                description={
                  <div style={{ marginTop: 1 }}>
                    {this.isQuiz() && <p>Chọn vào các ô là đáp án đúng</p>}
                    <Checkbox.Group
                      onChange={this.onChangeCheckBox}
                      value={this.state.checkedOptions}
                    >
                      {this.state.options.map(o => {
                        return (
                          <Checkbox
                            key={o.id}
                            style={{
                              display: 'block',
                              height: '30px',
                              lineHeight: '30px',
                              marginLeft: 10
                            }}
                            value={o.id}
                          >
                            {o.value}
                            <Icon
                              type="close-circle"
                              style={{ marginLeft: 20, fontSize: 15 }}
                              onClick={() => this.onClickRemoveOption(o)}
                            />
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>
                    <Search
                      enterButton="Thêm lựa chọn"
                      onSearch={this.onClickBtnAddOption}
                      style={{ marginTop: 18 }}
                      value={this.state.inputAddOption}
                      onChange={e => {
                        this.setState({ inputAddOption: e.target.value });
                      }}
                    />
                  </div>
                }
              />
            )}
            {this.state.type === 'text' && this.isQuiz() && (
              <Step
                title={<h6>Lựa chọn đáp án cho câu hỏi</h6>}
                icon={<Icon type="appstore" />}
                status="finish"
                className="mt-3"
                description={
                  <div style={{ marginTop: 10 }}>
                    {this.state.textAnswers.map((tag, index) => {
                      return (
                        <Tag
                          key={tag}
                          closable={index !== 0}
                          onClose={() => this.handleClose(tag)}
                        >
                          {tag}
                        </Tag>
                      );
                    })}
                    {this.state.showInputAddText && (
                      <Input
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={this.state.inputAddText}
                        onChange={e => {
                          this.setState({ inputAddText: e.target.value });
                        }}
                        onBlur={this.handleAddTextInputConfirm}
                        onPressEnter={this.handleAddTextInputConfirm}
                      />
                    )}
                    {!this.state.showInputAddText && (
                      <Tag
                        onClick={() => {
                          this.setState({ showInputAddText: true });
                        }}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" /> New answer
                      </Tag>
                    )}
                  </div>
                }
              />
            )}
            <Step
              title={<h6>Preview</h6>}
              icon={<Icon type="check-circle" />}
              status="finish"
              className="mt-3"
              description={
                <>
                  {<h5>{this.state.title || 'Nội dung câu hỏi'}</h5>}
                  {this.state.type === 'text' && (
                    <Input
                      style={{ marginTop: 20 }}
                      placeholder="Câu trả lời từ người dùng"
                    />
                  )}
                  {this.state.type === 'single' && (
                    <div style={{ marginTop: 10 }}>
                      <Radio.Group
                        value={this.state.selectedOption}
                        style={{ marginLeft: 10 }}
                        onMouseEnter={null}
                        onMouseLeave={null}
                        onChange={null}
                      >
                        {this.state.options.map(o => {
                          return (
                            <Radio
                              key={o.id}
                              style={{
                                display: 'block',
                                height: '30px',
                                lineHeight: '30px'
                              }}
                              value={o.id}
                            >
                              {o.value}
                            </Radio>
                          );
                        })}
                      </Radio.Group>
                    </div>
                  )}
                  {this.state.type === 'multiple' && (
                    <div style={{ marginTop: 10 }}>
                      <Checkbox.Group
                        value={this.state.checkedOptions}
                        onChange={null}
                      >
                        {this.state.options.map(o => {
                          return (
                            <Checkbox
                              key={o.id}
                              style={{
                                display: 'block',
                                height: '30px',
                                lineHeight: '30px',
                                marginLeft: 10
                              }}
                              value={o.id}
                              onChange={null}
                              onMouseEnter={null}
                              onMouseLeave={null}
                              onClick={null}
                              onKeyDown={null}
                              onKeyPress={null}
                            >
                              {o.value}
                            </Checkbox>
                          );
                        })}
                      </Checkbox.Group>
                    </div>
                  )}
                </>
              }
            />
          </Steps>
        </Form>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right'
          }}
        >
          <Button onClick={this.onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.onClickSave} type="primary">
            Save
          </Button>
        </div>
      </>
    );
  }
}

export default withNamespaces()(QuestionEditor);
