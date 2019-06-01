const Pool = require('pg').Pool;
// use to connect change the env variables (remote db)
require('dotenv').config();

const cn = new Pool({
  host: 'localhost',
  database: 'harrydb',
  port: 5432,
});

module.exports = {cn};