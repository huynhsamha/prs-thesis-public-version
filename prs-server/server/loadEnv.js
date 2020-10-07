const path = require('path');

/**
 * NODE_ENV: set from npm start script
 * { production | development }
 */
const mode = process.env.NODE_ENV || 'development';

// env files: { .env.production | .env.development }
const envPath = path.join(__dirname, `../.env.${mode}`);

const load = () => {
  require('dotenv').config({ path: envPath });
};

module.exports = {
  load
};
