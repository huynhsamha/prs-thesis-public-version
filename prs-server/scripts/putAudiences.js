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

const Audience = require('../mongodb/models/audience');

async function execute() {
  return new Promise((resolve, reject) => {

    const data = fs.readFileSync(path.join(__dirname, './db/audiences.txt'), { encoding: 'utf-8' }).toString();
    const emails = data.split('\n').filter(t => !!t).map(t => t.trim()).filter(t => !!t);

    const audiences = emails.map(e => new Audience.Model(({ email: e, googleId: e })));

    Audience.Model.insertMany(audiences).then((data) => {
      console.log(data);
      resolve();
    })
      .catch(reject);
  });
}
