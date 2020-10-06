import React from 'react';
import { Radio, Collapse, Tag, Checkbox } from '../../antd';
import { withNamespaces } from 'react-i18next';
import { labelColors } from '../../utils/constant';

const { Panel } = Collapse;

class PollPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      json: {},
      surveyOrQuiz: '', // survey | quiz
      quickOrFull: '', // full | quick
      title: '',
      questions: []
    };

    const { json } = props;
    if (json) {
      this.state.json = json;
      this.state.surveyOrQuiz = json.surveyOrQuiz;
      this.state.quickOrFull = json.quickOrFull;
      this.state.questions = json.questions;
      this.state.title = json.title;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { json } = nextProps;
    if (json) {
      this.setState({
        json,
        surveyOrQuiz: json.surveyOrQuiz,
        quickOrFull: json.quickOrFull,
        questions: json.questions,
        title: json.title
      });
    } else {
      this.setState({
        json: {},
        surveyOrQuiz: '', // survey | quiz
        quickOrFull: '', // full | quick
        title: '',
        questions: []
      });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <h5 className="mt-2">
          Tiêu đề: {this.state.title || 'Tiêu đề mẫu câu hỏi'}
        </h5>
        <h6 className="mt-3 mb-2">
          Phân loại:
          <Tag
            color={labelColors[this.state.surveyOrQuiz]}
            className="ml-2 mr-2"
          >
            {t(this.state.surveyOrQuiz)}
          </Tag>
          <Tag color={labelColors[this.state.quickOrFull]} className="ml-2">
            {t(this.state.quickOrFull)}
          </Tag>
        </h6>

        <h6 className="mb-3 mt-3">Bảng câu hỏi</h6>
        <Collapse bordered={false} expandIconPosition="left">
          {this.state.questions.map(q => (
            <Panel
              header={<>{q.title || 'Nội dung câu hỏi'}</>}
              key={q.title}
              extra={
                <>
                  {q.type ? <i>{'[' + t(q.type + '-label') + ']'}</i> : ''}
                  <span className="mr-3"></span>
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
                        value={(q.choices.filter(o => o.isCorrect)[0] || {}).id}
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
      </>
    );
  }
}

export default withNamespaces()(PollPreview);
