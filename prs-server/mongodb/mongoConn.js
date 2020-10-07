const mongoose = require('mongoose');

const { mongodb } = require('../server/config');

function connect() {
  mongoose.connect(mongodb.uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: mongodb.connectionPoolSize
  })
    .then(() => console.log(`Connected to MongoDB ${mongodb.uri}`))
    .catch(() => console.error(`Could not connect to MongoDB ${mongodb.uri}`));
}

async function asyncConnect() {
  return mongoose.connect(mongodb.uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: mongodb.connectionPoolSize
  });
}

module.exports = {
  connect,
  asyncConnect
};
