const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db');
const router = require('./routes/index.router');
const path = require('path');

db.create('redis://identityredis', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Redis server running");
    }
});
app.use(bodyParser.json())
app.use('/', router);
app.set("view engine", "ejs");
app.use(express.static(path.resolve('./public')));

// app.use(errorHandler)


// function errorHandler(err, req, res, next) {
//     res.status(500);
//     return res.render({
//         error: err
//     })
// }

app.listen(4000, () => {
    console.log(`Listening on port 4000`);
})

module.exports = app;