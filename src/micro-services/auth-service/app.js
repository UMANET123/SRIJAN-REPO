const express = require('express');
const router = require('./routes/index.router');
const {NODE_SETTINGS:{portNumber}} = require('./config/environment');
const app = express();

const httpPostOnlyMiddleware = require('./middleware/http-only-post.middleware');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(httpPostOnlyMiddleware);
app.use('/', router);
app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});


// pg.connect("postgres://wakanda_auth_service:12345@db:5432/wakanda_auth_db");



module.exports = app;