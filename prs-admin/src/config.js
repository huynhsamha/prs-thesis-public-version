export const isDev = process.env.NODE_ENV === 'development';
export const apiPath = isDev ? '' : 'https://api.prs.hcmutchain.net';
