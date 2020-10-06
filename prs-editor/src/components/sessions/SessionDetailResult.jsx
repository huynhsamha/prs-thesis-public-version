import React from 'react';
import { Tag } from '../../antd';

import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap';

import * as apiService from '../../api';
import { appColors } from '../../utils/constant';
import HorizontalLoading from '../../components/HorizontalLoading';

import { Pie } from 'react-chartjs-2';
import ListFeedbacks from '../results/ListFeedbacks';
import io from 'socket.io-client';
import * as config from '../../config';
import * as SocketMsg from '../../assets/socket/socket.message';

import {
  backgroundColor,
  hoverBackgroundColor
} from '../../utils/chartjsConfig.js';

class SessionDetailResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      feedback: [],
      questions: []
    };

    const { sessionId, pollID } = props;
    this.sesionId = sessionId;
    this.pollID = pollID;
    console.log('SessionDetailResult: ' + sessionId + ' ' + pollID);
    this.socket = null;
    this.setupSocket();

    this.doAll();
  }

  setupSocket() {
    this.socket = io.connect(config.wsPath);
    this.socket.on('connect', () => {
      console.log('Connected');
      this.socket.emit(SocketMsg.joinSession, { sessionId: this.sesionId });
    });
    this.socket.on(SocketMsg.ackJoinSessionSuccess, data => {
      console.log(data);
    });
    this.socket.on(SocketMsg.newFeedback, data => {
      // console.log(data);
      const { feedback } = data;
      this.state.feedback.push(feedback);
      this.setState({ feedback: this.state.feedback });
      this.handleDataChart();
    });
  }

  async getFeedback() {
    return apiService.getFeedbackOfSessionWithUserInfo(this.sesionId);
  }

  async getPollDetail() {
    return apiService.getOnePoll(this.pollID).then(data => data.data);
  }

  doAll() {
    this.getPollDetail().then(pollDetail => {
      this.pollDetail = pollDetail;
      this.getFeedback().then(feedback => {
        // console.log(feedback);
        this.state.feedback.push(...feedback);
        this.setState({
          feedback: this.state.feedback,
          loading: false
        });
        this.handleDataChart();
      });
    });
  }

  handleDataChart() {
    const poll = this.pollDetail;
    const feedback = [...this.state.feedback];
    let { questions } = poll;
    questions = [...questions].map(q => {
      const { title, type, choices, _id } = q;
      const answers = feedback.map(f => {
        return f.answers[_id];
      });
      const count = {};
      const inc = id => {
        count[id] = (count[id] || 0) + 1;
      };
      for (let v of answers) {
        if (q.type == 'multiple') {
          // multiple choices, array type
          for (let x of v) {
            inc(x);
          }
        } else {
          // single choices or text, primitive type
          if (v && v != '') inc(v);
        }
      }
      let _choices = null;
      if (q.type == 'text') {
        const texts = Object.keys(count);
        if (texts.length == 0) {
          _choices = [];
        } else {
          let aChoices = texts.map(t => ({ id: t, value: t, count: count[t] }));
          let top = aChoices.sort((a, b) => b.count - a.count);
          if (top.length <= 10) {
            _choices = top;
          } else {
            let total = texts.map(t => count[t]).reduce((a, b) => a + b, 0);
            let i = 0,
              sum = 0;
            while (i < top.length && sum * 2 <= total) {
              sum += top[i++].count;
            }
            _choices = top.slice(0, i);
            const order = { id: 'Other', value: 'Other', count: total - sum };
            _choices.push(order);
          }
        }
      } else {
        _choices = [...choices].map(c => {
          const { _id, id, value, isCorrect } = c;
          return { ...c, count: count[id] };
        });
      }
      return {
        _id,
        title,
        type,
        choices: _choices,
        answers
      };
    });
    this.setState({ questions });
  }

  renderCount() {
    return (
      <Row>
        <Col xs={12} sm={6} md={6} lg={3}>
          <Card className="card-stats">
            <CardBody>
              <Row>
                <Col xs={5} md={4}>
                  <div className="icon-big text-center">
                    <i className="fa fa-poll text-warning" />
                  </div>
                </Col>
                <Col xs={7} md={8}>
                  <div className="numbers">
                    <p className="card-category">Lượt phản hồi</p>
                    <CardTitle tag="p">
                      {(this.state.feedback || []).length}
                    </CardTitle>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  renderCharts() {
    return (
      <Row>
        {this.state.questions.map(q => {
          return (
            <Col
              xm={12}
              sm={12}
              md={12}
              lg={6}
              xl={6}
              key={q._id}
              style={{ marginTop: 15, marginBottom: 25 }}
            >
              <CardTitle className="h6">
                {q.title}
                <Tag
                  color={
                    q.type == 'single'
                      ? appColors.info
                      : q.type == 'text'
                        ? appColors.warning
                        : appColors.danger
                  }
                  className="ml-2"
                >
                  {q.type}
                </Tag>
              </CardTitle>
              <div className="mt-3">
                <Pie
                  data={{
                    labels: q.choices.map(c => c.value),
                    datasets: [
                      {
                        data: q.choices.map(c => c.count),
                        backgroundColor,
                        hoverBackgroundColor
                      }
                    ]
                  }}
                />
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }

  render() {
    return (
      <div className="mb-3">
        <div className="mt-2">
          {this.state.loading ? (
            <HorizontalLoading visible={true} />
          ) : (
              <div>
                <h4>Kết quả thống kê</h4>
                {this.renderCount()}
                <ListFeedbacks
                  data={this.state.feedback}
                  questions={this.state.questions}
                />
                <div className="mt-5">
                  <h4>Thống kê kết quả</h4>
                  {this.renderCharts()}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default SessionDetailResult;
