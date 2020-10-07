const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');

const Poll = require('../../mongodb/models/poll');
const Session = require('../../mongodb/models/session');
const Feedback = require('../../mongodb/models/feedback');
const Audience = require('../../mongodb/models/audience');

const config = require('../config');

const pollID = process.env.CNPM_POLL_ID;

const vipEmails = fs.readFileSync(path.join(config.configDirPath, './vip.txt'), { encoding: 'utf-8' })
  .toString().split('\n').filter(t => !!t)
  .map(t => t.trim())
  .filter(t => !!t);

const nQuestions = 6;

// init on first request
let poll = null;
let Question = null; // { index: { qid, mapPoint } }

console.log('======================================');
console.log('VIP Emails:');
console.log(vipEmails);

// const codes = [3001, 3002, 3003, 3004, 3005, 3006];
const codes = [3001, 3002, 3003, 3004, 3005];
const names = {
  3001: 'Thầy Thắng',
  3002: 'Thầy Vương',
  3003: 'Thầy Thuận',
  3004: 'Thầy Thơ',
  3005: 'Thầy Trung',
  3006: 'Demo'
};

console.log('CNPM Codes:');
console.log(codes);
console.log(names);

async function init() {
  return new Promise(async (resolve, reject) => {
    try {
      // ================================================
      // Poll
      if (!poll) {
        console.log(`Get poll: ${pollID}`);
        poll = await Poll.Model.findById(pollID);
      }
      // console.log(poll);
      if (!poll) throw new Error('Poll not found');
      console.log(`Poll: ${poll.title}`);

      // ================================================
      // Questions
      if (!Question) {
        console.log('Get questions');
        Question = {};
        for (let i = 0; i < nQuestions; i++) {
          const question = poll.questions[i];
          // console.log(question);
          console.log(`Question ${i}: ${question.title}`);
          const qid = question._id;
          const choices = question.choices;
          // console.log(choices);
          const mapPoint = { 0: 0 }; // skip question: assign {id->0, point->0}
          choices.forEach((c) => {
            const { id, value } = c;
            const point = parseInt(value.split('đ')[0], 10);
            console.log(`ChoiceID=${id} , Value=${value} , Point=${point}`);
            mapPoint[id] = point;
          });
          console.log(`Map points: ${mapPoint}`);
          Question[i] = { qid, mapPoint };
        }
      }

      // ================================================
      // VIPs
      console.log('Get VIPs');
      const vips = await Audience.Model.find({ email: { $in: vipEmails } });
      // console.log(vips);
      console.log('VIP Email Map:');
      const vipID = (vips || []).map((vip) => {
        const { _id, email } = vip;
        console.log(email, _id);
        return _id;
      });
      console.log('VIPs:', vipID);

      resolve(vipID);

    } catch (e) {
      reject(e);
    }
  });
}

async function execute(cnpmCode = '', vipID = []) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    try {
      // ================================================
      // Sessions
      const sessions = await Session.Model.find({ pollID, cnpm: cnpmCode });
      // console.log(sessions);
      async.eachSeries(sessions || [], async (session) => {
        const { _id, code, title } = session;
        console.log(`> ${code} - ${_id} : ${title}`);

        const stats = {};
        for (let i = 0; i < nQuestions; i++) {
          stats[i] = 0;
        }

        // ================================================
        // Feedbacks
        const feedbacks = await Feedback.Model.find({ sessionId: _id, owner: { $in: vipID } });
        const nFeedbacks = (feedbacks || []).length;
        console.log(`nFeedbacks: ${nFeedbacks}`);
        (feedbacks || []).forEach((fb) => {
          if (!fb.answers) {
            console.log(`---> Null answer: ${fb._id}`);
            return;
          }
          for (let i = 0; i < nQuestions; i++) {
            const { qid, mapPoint } = Question[i];
            const answer = fb.answers[qid] || 0; // skip question, assign id->0
            // console.log(answer);
            const point = mapPoint[answer];
            // console.log(point);
            stats[i] += point;
          }
        });
        console.log(stats);

        // avg
        let avg = 0;
        if (nFeedbacks > 0) {
          for (let i = 0; i < nQuestions; i++) {
            stats[i] /= nFeedbacks;
            avg += stats[i];
          }
          avg /= nQuestions;
        }

        const row = [code, title, avg];
        for (let i = 0; i < nQuestions; i++) row.push(stats[i]);
        // console.log(row);
        result.push(row);

        Promise.resolve();

      }, (err) => {
        if (!err) {
          resolve(result);

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

async function executeAllSheets() {
  return new Promise(async (resolve, reject) => {
    try {
      const vipID = await init();

      const dataSheets = {};

      async.eachSeries(codes, async (code) => {
        const result = await execute(`${code}`, vipID);
        dataSheets[code] = result;
        Promise.resolve();

      }, (err) => {
        if (err) {
          console.log(err);
        }
        resolve(dataSheets);
      });

    } catch (e) {
      reject(e);
    }
  });
}

const exportDataExcel = async (req, res) => {
  try {
    const dataSheets = await executeAllSheets();

    const workbook = new Excel.Workbook();

    workbook.creator = 'PRS';
    workbook.lastModifiedBy = 'PRS';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;
    workbook.views = [
      {
        x: 0, y: 0, width: 20000, height: 10000,
        firstSheet: 0, activeTab: 0, visibility: 'visible'
      }
    ];

    codes.forEach((code) => {
      const name = names[code];
      const result = dataSheets[code] || [];

      const worksheet = workbook.addWorksheet(name);
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];

      const header = ['Code', 'Title', 'Avg'];
      for (let i = 0; i < nQuestions; i++) header.push(`Avg_Q${i + 1}`);
      worksheet.addRow(header);
      worksheet.addRows(result);

      // width
      for (let i = 1; i <= 30; i++) { // default
        worksheet.getColumn(i).width = 12;
      }
      worksheet.getColumn(2).width = 100; // title

      // bold
      [1].forEach((i) => {
        worksheet.getRow(i).font = { bold: true };
      });
    });

    // response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Result.xlsx');

    workbook.xlsx.write(res)
      .then((data) => {
        res.end();
        console.log('Send excel done!');
      });

  } catch (err) {
    console.log(err);
    res.status(500).send(`Error: ${err.message}`);
  }
};

module.exports = {
  exportDataExcel
};
