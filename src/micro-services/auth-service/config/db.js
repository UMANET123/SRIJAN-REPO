const {Pool} = require('pg');
const {DB_SETTINGS} = require('./environment');
const pool = new Pool(DB_SETTINGS);

// demo query
// pool.query('SELECT NOW()', function(err, res) {
//     if (err) throw err;
//     console.log(res.rows);
//   });
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err); // your callback here
    process.exit(-1);
  })
module.exports = pool;