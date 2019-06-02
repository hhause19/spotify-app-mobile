const Pool = require('pg').Pool;
const Client = require('pg').Client;

require('dotenv').config();

/**
 * @const cn - inits a postgres pool with correct db info
 * TODO: add env variables to control aws db access
 */
// const cn = new Pool({
//   host: process.env.HARRY_DB_HOST,
//   database: process.env.HARRY_DB_DATABASE,
//   port: process.env.HARRY_DB_PORT,
// });

const cn = new Pool({
  host: process.env.HARRY_DB_HOST,
  database: process.env.HARRY_DB_DATABASE,
  port: process.env.HARRY_DB_PORT,
  user: process.env.HARRY_DB_USERNAME,
  password: process.env.HARRY_DB_PASSWORD
});

module.exports = cn;