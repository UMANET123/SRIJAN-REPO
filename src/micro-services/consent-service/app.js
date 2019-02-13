const express = require('express');
const router = require('./routes/index.router');
const {NODE_SETTINGS:{portNumber}, BASE_PATH} = require('./config/environment');
const app = express();

// const httpPostOnlyMiddleware = require('./middleware/http-only-post.middleware');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(httpPostOnlyMiddleware);
app.use(`${BASE_PATH}`, router);

app.listen(portNumber, () => {
    console.log(`App running on port ${portNumber}`);
});



module.exports = app;