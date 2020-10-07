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
    Audience.Model.find().then((data) => {
      console.log(data);
      resolve();
    })
      .catch(reject);
  });
}
