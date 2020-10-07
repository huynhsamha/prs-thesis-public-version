const async = require('async');
const fs = require('fs');
const path = require('path');
require('../server/loadEnv').load();

require('../mongodb/mongoConn').asyncConnect()
  .then(() => {
    console.log('Connected');
    return execute();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const Poll = require('../mongodb/models/poll');
const Session = require('../mongodb/models/session');
const Feedback = require('../mongodb/models/feedback');
const Audience = require('../mongodb/models/audience');

const pollID = process.env.CSE_POLL_ID;

const isVip = {};
const vipEmails = fs.readFileSync(path.join(__dirname, './db/vip.txt'), { encoding: 'utf-8' })
  .toString().split('\n').filter(t => !!t)
  .map(t => t.trim())
  .filter(t => !!t);

const points = [5, 4, 3, 2, 1];
const result = [
  // First row
  [
    'Code', 'Title', 'Avg', 'Avg by VIP', 'Total feedbacks', 'Total by VIP',
    ...(points.map(p => `Count ${p} điểm`)),
    ...(points.map(p => `Count ${p} điểm by VIP`))
  ]
];

async function execute() {
  return new Promise(async (resolve, reject) => {
    try {
      // ================================================
      // Poll
      const poll = await Poll.Model.findById(pollID);
      // console.log(poll);
      console.log(`Poll: ${poll.title}`);
      const question = poll.questions[5];
      // console.log(question);
      console.log(`Question: ${question.title}`);
      const qid = question._id;
      const choices = question.choices;
      // console.log(choices);
      const mapPoint = {};
      choices.forEach((c) => {
        const { id, value } = c;
        const point = parseInt(value.split(' điểm')[0], 10);
        console.log(`ChoiceID=${id} , Value=${value} , Point=${point}`);
        mapPoint[id] = point;
      });

      // ================================================
      // VIPs
      const vips = await Audience.Model.find({ email: { $in: vipEmails } });
      // console.log(vips);
      vips.forEach((vip) => { isVip[vip._id] = true; });
      console.log('VIPs:', isVip);

      // ================================================
      // Sessions
      const sessions = await Session.Model.find({ pollID, isCSE: true });
      // console.log(sessions);
      async.eachSeries(sessions, async (session) => {
        const { _id, code, title } = session;
        console.log(`> ${code} - ${_id} : ${title}`);

        const stats = {
          counter: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          vip: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          nVip: 0,
          total: 0,
          totalByVip: 0
        };

        // ================================================
        // Feedbacks
        const feedbacks = await Feedback.Model.find({ sessionId: _id });
        // console.log(data);
        feedbacks.forEach((fb) => {
          const answer = fb.answers[qid];
          // console.log(answer);
          const ownerId = fb.owner.toString();
          const point = mapPoint[answer];
          // console.log(point);
          stats.total += point;
          stats.counter[point]++;
          if (isVip[ownerId]) {
            stats.nVip++;
            stats.totalByVip += point;
            stats.vip[point]++;
          }
        });

        const a = points.map(i => stats.counter[i]);
        const b = points.map(i => stats.vip[i]);
        const total = feedbacks.length;
        const avg = total == 0 ? 'null' : (stats.total * 1.0 / total);
        const avgVip = stats.nVip == 0 ? 'null' : (stats.totalByVip * 1.0 / stats.nVip);
        result.push([code, title, avg, avgVip, total, stats.nVip, ...a, ...b]);

        Promise.resolve();

      }, (err) => {
        if (!err) {

          // ================================================
          // Write results
          const data = result.map(row => row.join(',')).join('\n');
          if (!fs.existsSync(path.join(__dirname, './out'))) {
            fs.mkdirSync(path.join(__dirname, './out'));
          }
          fs.writeFileSync(path.join(__dirname, './out/results.csv'), data);

          resolve();

        } else {
          console.log(err);
          throw err;
        }
      });

    } catch (e) {
      reject(e);
    }
  });
}
