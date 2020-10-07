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

const Audience = require('../mongodb/models/audience');


const isVip = {};
const vipEmails = fs.readFileSync(path.join(__dirname, './db/vip.txt'), { encoding: 'utf-8' })
  .toString().split('\n').filter(t => !!t)
  .map(t => t.trim())
  .filter(t => !!t);

async function execute() {
  return new Promise(async (resolve, reject) => {
    try {

      const vips = await Audience.Model.find({ email: { $in: vipEmails } });
      // console.log(vips);
      vips.forEach((vip) => { isVip[vip._id] = true; });
      console.log(isVip);

      resolve();

    } catch (e) {
      reject(e);
    }
  });
}
