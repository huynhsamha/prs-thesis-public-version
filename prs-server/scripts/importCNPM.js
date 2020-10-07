const fs = require('fs');
const path = require('path');

const pollId = '5f2***fb64';
const trungId = '5f20***b4d';
const noreplyId = '5f***96';
const localId = '5ebd***6c2';

const ownerId = noreplyId;

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

const Session = require('../mongodb/models/session');
const mongoose = require('mongoose');

async function execute() {
  return new Promise((resolve, reject) => {

    const name = 'all';

    const data = fs.readFileSync(path.join(__dirname, `./tmp/${name}.csv`), { encoding: 'utf-8' }).toString();
    const rows = data.split('\n').filter(t => !!t);

    const sessions = rows.map((row) => {
      const g = row.split(',');
      const gc = g[0], gv = g[1], code = g[2], gn = g[3];
      const session = {
        password: null,
        usePassword: false,
        pollID: mongoose.Types.ObjectId(pollId),
        editorID: mongoose.Types.ObjectId(ownerId),
        title: `Đánh giá môn TTCNPM - ${gv} - Nhóm "${gn}"`,
        activeTime: new Date('09/01/2020'),
        finishTime: new Date('09/02/2020'),
        code,
        type: 'public',
        allowBlockchain: false,
        cnpm: gc
      };
      return new Session.Model(session);
    });

    // console.log(sessions);
    // resolve();

    Session.Model.insertMany(sessions).then((data) => {
      console.log(data);
      resolve();
    })
      .catch(reject);
  });
}
