const express = require('express');
const router = require('./routes/index.router');
const {NODE_SETTINGS:{portNumber}, CONSENT_BASE_PATH} = require('./config/environment');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CONSENT_BASE_PATH, router);

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});



module.exports = app;