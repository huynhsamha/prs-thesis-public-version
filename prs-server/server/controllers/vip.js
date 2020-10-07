const fs = require('fs');
const path = require('path');
const async = require('async');
const Excel = require('exceljs');

const Poll = require('../../mongodb/models/poll');
const Session = require('../../mongodb/models/session');
const Feedback = require('../../mongodb/models/feedback');
const Audience = require('../../mongodb/models/audience');

const config = require('../config');

const pollID = process.env.CSE_POLL_ID;
const points = [0, 5, 4, 3, 2, 1]; // 0 is skip question
const isVip = {};
const vipEmails = fs.readFileSync(path.join(config.configDirPath, './vip.txt'), { encoding: 'utf-8' })
  .toString().split('\n').filter(t => !!t)
  .map(t => t.trim())
  .filter(t => !!t);

console.log('======================================');
console.log('VIP Emails:');
console.log(vipEmails);

async function execute() {
  return new Promise(async (resolve, reject) => {
    const result = [];
    try {
      // ================================================
      // Poll
      const poll = await Poll.Model.findById(pollID);
      // console.log(poll);
      if (!poll) throw new Error('Poll not found');
      console.log(`Poll: ${poll.title}`);
      const question = poll.questions[5];
      // console.log(question);
      console.log(`Question: ${question.title}`);
      const qid = question._id;
      const choices = question.choices;
      // console.log(choices);
      const mapPoint = { 0: 0 }; // skip question: assign {id->0, point->0}
      choices.forEach((c) => {
        const { id, value } = c;
        const point = parseInt(value.split(' điểm')[0], 10);
        console.log(`ChoiceID=${id} , Value=${value} , Point=${point}`);
        mapPoint[id] = point;
      });
      console.log(`Map points: ${mapPoint}`);

      // ================================================
      // VIPs
      const vips = await Audience.Model.find({ email: { $in: vipEmails } });
      // console.log(vips);
      (vips || []).forEach((vip) => { isVip[vip._id] = true; });
      console.log('VIPs:', isVip);

      // ================================================
      // Sessions
      const sessions = await Session.Model.find({ pollID, isCSE: true });
      // console.log(sessions);
      async.eachSeries(sessions || [], async (session) => {
        const { _id, code, title } = session;
        console.log(`> ${code} - ${_id} : ${title}`);

        const stats = {
          counter: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, // 0 is skip
          vip: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, // 0 is skip
          nVip: 0,
          total: 0,
          totalByVip: 0
        };

        // ================================================
        // Feedbacks
        const feedbacks = await Feedback.Model.find({ sessionId: _id });
        // console.log(data);
        (feedbacks || []).forEach((fb) => {
          if (!fb.answers) {
            console.log(`---> Null answer: ${fb._id}`);
            return;
          }
          const answer = fb.answers[qid] || 0; // skip question, assign id->0
          // console.log(answer);
          const ownerId = (fb.owner || '').toString();
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

        // counter điểm thành phần
        const a = points.map(i => stats.counter[i]);
        const b = points.map(i => stats.vip[i]);

        const nFeedbacksNoSkip = feedbacks.length - stats.counter[0];
        const avg = nFeedbacksNoSkip == 0 ? -1 : (stats.total * 1.0 / nFeedbacksNoSkip);

        const nVipNoSkip = stats.nVip - stats.vip[0];
        const avgVip = nVipNoSkip == 0 ? -1 : (stats.totalByVip * 1.0 / nVipNoSkip);

        result.push([code, title, avg, avgVip, feedbacks.length, stats.nVip, ...a, ...b]);

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

const exportDataExcel = async (req, res) => {
  try {
    const result = await execute();

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
        firstSheet: 0, activeTab: 1, visibility: 'visible'
      }
    ];
    const worksheet = workbook.addWorksheet('Result');
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 2 }
    ];

    // header là 2 dòng đầu
    worksheet.addRow(['Code', 'Title', 'Average', '', 'Total Feedbacks', '',
      'Thống kê lựa chọn', '', '', '', '', '', // merge các ô
      'Thống kê lựa chọn by VIP', '', '', '', '', '' // merge các ô
    ]);
    worksheet.addRow(['', '', 'All', 'VIP', 'All', 'VIP',
      ...(points.map(p => (p > 0 ? `${p}đ` : 'Skip'))),
      ...(points.map(p => (p > 0 ? `${p}đ` : 'Skip')))
    ]);
    worksheet.addRows(result);

    // width
    for (let i = 1; i <= 6; i++) {
      worksheet.getColumn(i).width = 12;
    }
    for (let i = 7; i <= 18; i++) {
      worksheet.getColumn(i).width = 8; // point counter
    }
    worksheet.getColumn(2).width = 100; // title

    // font
    for (let i = 1; i <= 18; i++) {
      worksheet.getColumn(i).font = { size: 14 };
    }
    [3, 4].forEach((i) => {
      worksheet.getColumn(i).font.bold = true;
    });
    [1, 2].forEach((i) => {
      worksheet.getRow(i).font = { bold: true, size: 14 };
    });

    // merge
    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:D1');
    worksheet.mergeCells('E1:F1');
    worksheet.mergeCells('G1:L1');
    worksheet.mergeCells('M1:R1');

    // align
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabet.split('').forEach((c) => {
      [1, 2].forEach((r) => {
        const cell = `${c}${r}`;
        worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center' };
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

const exportDataCSV = async (req, res) => {
  try {
    const result = await execute();

    const FirstRow = [
      'Code', 'Title', 'Avg (All)', 'Avg by VIP', 'Total Feedbacks (All)', 'Total feedbacks by VIP',
      ...(points.map(p => (p > 0 ? `${p}đ` : 'Skip'))),
      ...(points.map(p => (p > 0 ? `${p}đ by VIP` : 'Skip by VIP')))
    ];

    const table = [FirstRow, ...result];

    const data = `\uFEFF${table.map(row => row.join(',')).join('\n')}`;

    return res.header('Content-Type', 'text/csv;charset=utf-8')
      .attachment('Result.csv')
      .status(200).send(data);

  } catch (err) {
    console.log(err);
    res.status(500).send(`Error: ${err.message}`);
  }
};

module.exports = {
  exportDataExcel,
  exportDataCSV
};
