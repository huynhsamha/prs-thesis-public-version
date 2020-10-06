export const isDev = process.env.NODE_ENV === 'development';

export const apiPath = isDev ? '' : 'https://api.prs.hcmutchain.net';

export const rootUrl = isDev
  ? 'http://localhost:3001'
  : 'https://editor.prs.hcmutchain.net';

export const rootApiUrl = isDev
  ? 'http://localhost:8000'
  : 'https://api.prs.hcmutchain.net';

export const userPath = isDev
  ? 'http://localhost:3000'
  : 'https://prs.hcmutchain.net';

export const wsPath = isDev
  ? 'http://localhost:8001/session'
  : 'https://ws.prs.hcmutchain.net/session';
