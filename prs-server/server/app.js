/**
 * Load environment variables from file `.env` to `process.env.*`
 * Environment variables should be access via `config.js`
 */
require('./loadEnv').load();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(expressSession);

const config = require('./config');

const app = express();

/**
 * Middlewares
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.set('trust proxy', 1); // trust first proxy
const DAY_IN_MS = 24 * 60 * 60 * 1000;
app.use(expressSession({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // set true when use https
    maxAge: 7 * DAY_IN_MS,
    httpOnly: true // disable js read sessionId
  },
  name: 'prs.sessionid',
  store: new MongoStore({
    url: config.mongodb.uri,
    collection: 'ExpressSessions'
  })
}));

// CORS on production
if (config.isProduction) {
  const domain = [
    'prs.hcmutchain.net',
    'admin.prs.hcmutchain.net',
    'editor.prs.hcmutchain.net'
  ];
  const whitelist = [
    ...domain.map(d => `http://${d}`),
    ...domain.map(d => `https://${d}`)
  ];
  console.log('Enable CORS on whitelist: ');
  console.log(whitelist);
  app.use(cors({
    origin: whitelist,
    credentials: true
  }));
}

/**
 * MongoDB connection
 */
require('../mongodb/mongoConn').connect();

/**
 * API routes
 */
const api = require('./routes');

app.use('/api/admin', api.admin);
app.use('/api/editor', api.editor);
app.use('/api/audience', api.audience);
app.use('/api/poll', api.poll);
app.use('/api/session', api.session);
app.use('/api/feedback', api.feedback);

// for CSE demo
// const vip = require('./controllers/vip');

/**
 * /vip/cse192?sk=prs2020&type=csv
 * /vip/cse192?sk=prs2020&type=excel
 */
// app.get('/vip/cse192', (req, res) => {
//   if (req.query.sk != 'prs2020') {
//     return res.status(500).send('Error');
//   }
//   if (req.query.type == 'csv') {
//     return vip.exportDataCSV(req, res);
//   }
//   if (req.query.type == 'excel') {
//     return vip.exportDataExcel(req, res);
//   }
//   return res.status(500).send('Error');
// });


// for TTCNPM demo
const vip = require('./controllers/vipCNPM');

app.get('/vip/ttcnpm', (req, res) => {
  if (req.query.sk != 'prs2020') {
    return res.status(500).send('Error');
  }
  return vip.exportDataExcel(req, res);
});

/**
 * Sockets
 */
require('./socket/session').init();

/**
 * Ethereum
 */
require('./services/eth.service').initialize();

/**
 * Init session codes
 */
setTimeout(() => {
  console.log('======================================');
  console.log('Start initAvailableSessionCodes');
  require('./services/session.service').initAvailableSessionCodes();

}, 5000);

/**
 * Start server
 */
app.listen(config.listenPort, () => {
  console.log(`Server is listening on port ${config.listenPort}`);
});
