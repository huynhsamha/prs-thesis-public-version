import React from 'react';
import {
  Button,
  Radio,
  Collapse,
  Icon,
  Tag,
  Steps,
  Drawer,
  Form,
  Input,
  Checkbox,
  notification
} from '../../antd';
import { withNamespaces } from 'react-i18next';

import PollJsonModal from './PollJsonModal';
import QuestionEditor from './QuestionEditor';
import {
  alertError,
  alertSuccess,
  confirmWarning
} from '../../utils/customAlert';

import * as apiService from '../../api';

const openNotificationWithIcon = ({ type, title, message }) => {
  notification[type]({
    message: title,
    description: message,
    duration: 3
  });
};

const { Panel } = Collapse;
const { Step } = Steps;

class PollEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'create', // create | update
      showDrawerEditQuestion: false,

      surveyOrQuiz: '', // survey | quiz
      quickOrFull: '', // full | quick
      title: '',
      questions: [],

      json: {},

      questionIdCounter: 0,
      activeQuestion: {},

      jsonModal: {},
      showModal: false,
      loadingModal: false
    };

    const { json, type } = props;
    // console.log(json, type);
    if (type === 'update' && json) {
      this.state.json = json;

      this.state.type = type;

      this.state.surveyOrQuiz = json.surveyOrQuiz || '';
      this.state.quickOrFull = json.quickOrFull || '';
      this.state.questions = json.questions || [];
      this.state.title = json.title || '';
    }
  }

  componentWillReceiveProps(nextProps) {
    const { json, type } = nextProps;
    console.log(json, type);
    if (type === 'update' && json) {
      this.setState({
        json,
        type,
        surveyOrQuiz: json.surveyOrQuiz || '',
        quickOrFull: json.quickOrFull || '',
        questions: json.questions || [],
        title: json.title || ''
      });
    } else {
      this.setState({
        type: 'create'
      });
    }
  }

  showDrawerEditQuestion = () => {
    this.setState({
      showDrawerEditQuestion: true
    });
  };

  onCloseDrawerEditQuestion = () => {
    this.setState({
      showDrawerEditQuestion: false
    });
  };

  showJsonModal = json => {
    this.setState({
      showModal: true,
      jsonModal: json
    });
  };

  renderDrawerEditQuestion = () => {
    return (
      <Drawer
        title="Question"
        width={720}
        onClose={this.onCloseDrawerEditQuestion}
        visible={this.state.showDrawerEditQuestion}
      >
        <QuestionEditor
          pollTitle={this.state.title}
          surveyOrQuiz={this.state.surveyOrQuiz}
          question={this.state.activeQuestion}
          notifyUpdateQuestion={this.notifyUpdateQuestion}
          onCloseDrawerEditQuestion={this.onCloseDrawerEditQuestion}
        />
      </Drawer>
    );
  };

  notifyUpdateQuestion = newQuestion => {
    this.setState({
      questions: this.state.questions.map(u => {
        if (u.id !== newQuestion.id) return u;
        return newQuestion;
      })
    });
  };

  renderSelectSurveyOrQuiz = () => {
    const { t } = this.props;
    return (
      <>
        <div>{t('title.select-poll-type')}</div>
        <ul>
          <li>
            <i>{t('quiz')}</i> : câu hỏi mang tính chất đúng sai
          </li>
          <li>
            <i>{t('survey')}</i> : câu hỏi mang tính khảo sát
          </li>
        </ul>
        <div style={{ marginTop: 15 }}>
          <Radio.Group
            buttonStyle="solid"
            size="large"
            value={this.state.surveyOrQuiz}
            onChange={e => {
              this.setState({
                surveyOrQuiz: e.target.value
              });
            }}
          >
            <Radio.Button value="quiz">{t('quiz')}</Radio.Button>
            <Radio.Button value="survey">{t('survey')}</Radio.Button>
          </Radio.Group>
        </div>
      </>
    );
  };

  reachedLimitedQuestions = () => {
    return (
      this.state.quickOrFull === 'quick' && this.state.questions.length >= 1
    );
  };

  onChangequickOrFull = e => {
    e.preventDefault();
    e.stopPropagation();
    const { t } = this.props;
    let val = e.target.value;
    if (val === this.state.quickOrFull) return;
    if (val === 'quick') {
      if (this.state.questions.length > 1) {
        alertError(t('message.questions-more-than-1'));
        return;
      }
    }
    this.setState({
      quickOrFull: e.target.value
    });
  };

  renderSelectquickOrFull = () => {
    const { t } = this.props;
    return (
      <>
        <div>Lựa chọn kiểu danh sách câu hỏi</div>
        <ul>
          <li>
            <i>{t('quick')}</i>: gồm 1 câu hỏi
          </li>
          <li>
            <i>{t('full')}</i>: bộ danh sách các câu hỏi
          </li>
        </ul>
        <div style={{ marginTop: 15 }}>
          <Radio.Group
            buttonStyle="solid"
            size="large"
            onChange={this.onChangequickOrFull}
            value={this.state.quickOrFull}
          >
            <Radio.Button value="quick">{t('quick')}</Radio.Button>
            <Radio.Button value="full">{t('full')}</Radio.Button>
          </Radio.Group>
        </div>
      </>
    );
  };

  onClickEditQuestion = q => {
    this.setState({ activeQuestion: q });
    this.showDrawerEditQuestion();
  };

  onRemoveQuestion = q => {
    confirmWarning('Bạn muốn xoá câu hỏi này khỏi bảng câu hỏi?').then(ok => {
      if (!ok) return;
      this.setState({
        questions: this.state.questions.filter(o => o.id !== q.id)
      });
    });
  };

  onClickAddQuestion = () => {
    this.state.questions.push({
      id: this.state.questionIdCounter + 1,
      title: '',
      type: '', // single | multiple | text
      choices: []
    });

    this.setState({
      questions: this.state.questions,
      questionIdCounter: this.state.questionIdCounter + 1
    });
  };

  renderCreateQuestion = () => {
    const { t } = this.props;
    return (
      <>
        <div>Tạo bảng câu hỏi</div>
        <div style={{ marginTop: 15 }}>
          <Collapse bordered={false} expandIconPosition="left">
            {this.state.questions.map(q => (
              <Panel
                header={<>{q.title || 'Nội dung câu hỏi'}</>}
                key={q.id}
                extra={
                  <>
                    {q.type ? <i>{'[' + t(q.type + '-label') + ']'}</i> : ''}
                    <span className="mr-3"></span>
                    <Icon
                      type="edit"
                      onClick={event => {
                        event.stopPropagation();
                        this.onClickEditQuestion(q);
                      }}
                      style={{ color: '#4086f7', fontSize: 18 }}
                    />
                    <span className="mr-3"></span>
                    <Icon
                      type="delete"
                      onClick={() => {
                        this.onRemoveQuestion(q);
                      }}
                      style={{ color: '#eb0025', fontSize: 18 }}
                    />
                  </>
                }
                style={{
                  background: '#f7f7f7',
                  borderRadius: 4,
                  marginBottom: 24,
                  border: 0,
                  overflow: 'hidden'
                }}
              >
                <div>
                  {q.type === 'single' && q.choices !== null && (
                    <>
                      <div style={{ marginTop: 10 }}>
                        <Radio.Group
                          value={
                            (q.choices.filter(o => o.isCorrect)[0] || {}).id
                          }
                          style={{ marginLeft: 10 }}
                        >
                          {q.choices.map(o => {
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
                    </>
                  )}
                  {q.type === 'multiple' && q.choices !== null && (
                    <>
                      <div style={{ marginTop: 10 }}>
                        <Checkbox.Group
                          value={q.choices
                            .filter(u => u.isCorrect)
                            .map(u => u.id)}
                        >
                          {q.choices.map(o => {
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
                              </Checkbox>
                            );
                          })}
                        </Checkbox.Group>
                      </div>
                    </>
                  )}
                  {q.type === 'text' && this.state.surveyOrQuiz === 'quiz' && (
                    <>
                      <div style={{ paddingBottom: 20 }}>
                        Danh sách câu trả lời đúng
                      </div>
                      {q.choices.map(tag => {
                        return <Tag key={tag.id}>{tag.value}</Tag>;
                      })}
                    </>
                  )}
                </div>
              </Panel>
            ))}
          </Collapse>
          <Button
            type="primary"
            icon="plus"
            onClick={this.onClickAddQuestion}
            disabled={
              this.state.quickOrFull === 'quick' &&
              this.state.questions.length >= 1
            }
          >
            Thêm câu hỏi
          </Button>
        </div>
      </>
    );
  };

  getPollSchema = () => {
    const json = {
      title: this.state.title,
      surveyOrQuiz: this.state.surveyOrQuiz,
      quickOrFull: this.state.quickOrFull,
      questions: this.state.questions.map(q => {
        if (q.type === 'single') {
          return {
            type: 'single',
            title: q.title,
            choices: q.choices.map((o, i) => {
              return {
                id: i + 1,
                value: o.value,
                isCorrect: o.isCorrect
              };
            })
          };
        } else if (q.type === 'multiple') {
          return {
            type: 'multiple',
            title: q.title,
            choices: q.choices.map((o, i) => {
              return {
                id: i + 1,
                value: o.value,
                isCorrect: o.isCorrect
              };
            })
          };
        } else if (q.type === 'text') {
          return {
            type: 'text',
            title: q.title,
            choices: q.choices.map((o, i) => {
              return { id: i + 1, value: o.value };
            })
          };
        }
      })
    };
    return json;
  };

  onClickComplete = () => {
    const { t } = this.props;
    const { surveyOrQuiz, quickOrFull, title, questions } = this.state;
    if (
      (surveyOrQuiz !== 'survey' && surveyOrQuiz !== 'quiz') ||
      ((quickOrFull !== 'quick' && quickOrFull !== 'full') ||
        title === '' ||
        questions === null ||
        questions.filter(u => u === null).length > 0)
    ) {
      openNotificationWithIcon({
        type: 'error',
        title: t('error'),
        message: t('message.alert.missing')
      });
      return;
    }
    if (this.state.type === 'create') this.handleCreate();
    else this.handleUpdate();
  };

  handleCreate = () => {
    const { t } = this.props;
    confirmWarning(t('message.confirm.createPoll')).then(ok => {
      if (!ok) return;
      const schema = this.getPollSchema();
      // console.log(schema);
      apiService
        .createPoll(schema)
        .then(data => {
          console.log(data);
          alertSuccess(t('message.success.createPoll')).then(() => {
            window.location.reload();
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  handleUpdate = () => {
    const { t } = this.props;
    confirmWarning(t('message.confirm.updatePoll')).then(ok => {
      if (!ok) return;
      const schema = this.getPollSchema();
      schema.pollID = this.state.json._id;
      // console.log(schema);
      apiService
        .updatePoll(schema)
        .then(data => {
          console.log(data);
          alertSuccess(t('message.success.updatePoll')).then(() => {
            window.location.reload();
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  onClickCopyJSON = () => {
    const { t } = this.props;
    const schema = this.getPollSchema();
    this.showJsonModal(schema);
  };

  renderPollTitle = () => {
    return (
      <Form>
        <Form.Item
          validateStatus={
            !this.state.titleChanged || !this.state.titleBlured
              ? ''
              : this.state.title !== ''
              ? 'success'
              : 'error'
          }
        >
          <Input
            value={this.state.title}
            onChange={e => {
              this.setState({
                title: e.target.value,
                titleChanged: true
              });
            }}
            onBlur={e => {
              this.setState({
                titleBlured: true
              });
            }}
            allowClear
          />
        </Form.Item>
      </Form>
    );
  };

  handleCompleteChangeJson = json => {
    const { t } = this.props;
    const { surveyOrQuiz, quickOrFull, questions, title } = json;

    if (
      (surveyOrQuiz !== 'survey' && surveyOrQuiz !== 'quiz') ||
      ((quickOrFull !== 'quick' && quickOrFull !== 'full') ||
        title === '' ||
        questions === null ||
        questions.filter(u => u === null).length > 0)
    ) {
      openNotificationWithIcon({
        type: 'error',
        title: t('error'),
        message: t('message.alert.json-incorrect')
      });
      return;
    }

    this.setState({
      surveyOrQuiz: json.surveyOrQuiz,
      quickOrFull: json.quickOrFull,
      questions: json.questions,
      title: json.title,

      showModal: false
    });
  };

  handleOnCloseJsonModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { t } = this.props;

    return (
      <>
        <h4>{this.state.type === 'create' ? t('new-poll') : t('edit-poll')}</h4>
        <hr />
        <Steps direction="vertical">
          <Step
            status="finish"
            title={
              <h6>{t('survey') + ' ' + t('or') + ' ' + t('quiz') + '?'}</h6>
            }
            description={this.renderSelectSurveyOrQuiz()}
            icon={<Icon type="file-unknown" />}
          />
          <Step
            status="finish"
            title={
              <h6>{t('quick') + ' ' + t('or') + ' ' + t('full') + '?'}</h6>
            }
            description={this.renderSelectquickOrFull()}
            icon={<Icon type="clock-circle" />}
          />
          <Step
            status="finish"
            title={<h6>{t('title.poll')}</h6>}
            description={this.renderPollTitle()}
            icon={<Icon type="font-size" />}
          />
          <Step
            status="finish"
            title={<h6>{t('questionnaire')}</h6>}
            description={this.renderCreateQuestion()}
            icon={<Icon type="ordered-list" />}
          />
        </Steps>
        <hr />
        <div>
          <Button type="primary" icon="copy" onClick={this.onClickCopyJSON}>
            {t('edit-json')}
          </Button>
          <Button
            type="danger"
            icon="check"
            onClick={this.onClickComplete}
            style={{ marginLeft: 15 }}
          >
            {t('complete')}
          </Button>
        </div>

        {this.renderDrawerEditQuestion()}

        <PollJsonModal
          visible={this.state.showModal}
          title={t('edit-json')}
          json={this.state.jsonModal}
          loading={this.state.loadingModal}
          onComplete={this.handleCompleteChangeJson}
          onClose={this.handleOnCloseJsonModal}
        />
      </>
    );
  }
}

export default withNamespaces()(PollEditor);
