const {Pool} = require('pg');
const {DB_SETTINGS} = require('./environment');
const pool = new Pool(DB_SETTINGS);

// demo query
// pool.query('SELECT NOW()', function(err, res) {
//     if (err) throw err;
//     console.log(res.rows);
//   });

module.exports = pool;