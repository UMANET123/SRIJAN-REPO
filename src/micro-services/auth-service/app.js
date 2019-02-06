const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const router = require('./routes/index.router');
const environment = require('./config/environment');
const app = express();

const httpPostOnlyMiddleware = require('./middleware/http-only-post.middleware');

db.create("redis://authredis", (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Redis Server Running');
    }
});
console.log('db is on the way')
app.use(bodyParser.json());
app.use(httpPostOnlyMiddleware);
app.use('/', router)
app.listen(environment.PORT_NUMBER, () => {
    console.log(`App running on port ${environment.PORT_NUMBER}`);
});

const pg = require('pg');

var config = {
    user: "wakanda_auth_service",
    database: "wakanda_auth_db",
    host: "db",
    password: "12345",
    port: "5432"
  };


console.log("config : "+JSON.stringify(config));
var pool = new pg.Pool(config);
pool.query('SELECT NOW()', function(err, res) {
    if (err) throw err
    console.log(res.rows)
  })
// pg.connect("postgres://wakanda_auth_service:12345@db:5432/wakanda_auth_db");



module.exports = app;