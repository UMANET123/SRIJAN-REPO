const {Pool} = require('pg');
const {DB_SETTINGS} = require('./environment');
// console.log({DB_SETTINGS});
const pool = new Pool(DB_SETTINGS);
// console.log(pool);
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err); // your callback here
    process.exit(-1);
  })
module.exports = pool;