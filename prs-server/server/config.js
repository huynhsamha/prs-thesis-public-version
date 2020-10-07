const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';
const envName = isProduction ? 'production' : 'development';

const rootUrl = process.env.ROOT_URL;
const audienceUrl = process.env.AUDIENCE_URL;
const editorUrl = process.env.EDITOR_URL;
const adminUrl = process.env.ADMIN_URL;

// config directory
const configDirPath = path.join(__dirname, './config', envName);

// editor whitelist
const whitelistEditorsPath = path.join(configDirPath, './editor.whitelist.txt');
const whitelistEditors = fs.readFileSync(whitelistEditorsPath, 'utf8').split('\n')
  .filter(email => email != null && email.length > 0 && email.includes('@'));

const whitelistAudiences = process.env.AUDIENCES_WHITELIST.split(',');

module.exports = {
  isProduction,
  rootUrl,
  audienceUrl,
  editorUrl,
  adminUrl,
  listenPort: process.env.LISTEN_PORT,
  mongodb: {
    uri: process.env.MONGO_URI,
    connectionPoolSize: process.env.MONGO_CONN_POOL_SIZE
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    cookie: {
      admin: process.env.COOKIE_NAME_JWT_ADMIN
    }
  },
  cookie: {
    sessionId: process.env.COOKIE_NAME_SESSIONID
  },
  oauth2: {
    google: {
      audience: {
        clientId: process.env.AUDIENCES_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUDIENCES_GOOGLE_CLIENT_SECRET,
        authUrl: `${rootUrl}/api/audience/auth/google`,
        callbackUrl: `${rootUrl}/api/audience/auth/google/callback`
      },
      editor: {
        clientId: process.env.EDITOR_GOOGLE_CLIENT_ID,
        clientSecret: process.env.EDITOR_GOOGLE_CLIENT_SECRET,
        authUrl: `${rootUrl}/api/editor/auth/google`,
        callbackUrl: `${rootUrl}/api/editor/auth/google/callback`
      }
    }
  },
  whitelistAudiences,
  whitelistEditors,
  enableAudienceWhitelist: process.env.AUDIENCES_WHITELIST_ENABLE == 'true',
  eth: {
    provider: process.env.INFURA_PROVIDER || '',
    ropstenPrivateKey: process.env.ROPSTEN_PRIVATE_KEY || ''
  },
  configDirPath
};
