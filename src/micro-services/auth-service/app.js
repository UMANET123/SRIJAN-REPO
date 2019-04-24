const express = require("express");
const router = require("./routes/index.router");
const {
  NODE_SETTINGS: { portNumber },
  AUTH_BASE_PATH
} = require("./config/environment");
const app = express();

// const httpPostOnlyMiddleware = require('./middleware/http-only-post.middleware');
const authMiddleware = require('./middleware/authMiddleware'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(httpPostOnlyMiddleware);
app.use(authMiddleware);
app.use(AUTH_BASE_PATH, router);
app.listen(portNumber, () => {
  console.log(`App running on port ${portNumber}`);
});

module.exports = app;
