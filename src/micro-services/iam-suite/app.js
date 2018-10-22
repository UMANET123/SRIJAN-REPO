const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./config/db');
const router = require('./routes/index.router');
const user = require('./models/user.model');

db.create('redis://127.0.0.1:6379', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Redis server running");
    }
});
app.use(bodyParser.json())
app.use('/', router);

app.listen(4000, () => {
    console.log(`Listening on port 4000`);
})