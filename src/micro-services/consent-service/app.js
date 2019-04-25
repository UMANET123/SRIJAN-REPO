const express = require("express");
const router = require("./routes/index.router");
const morgan = require('morgan');
const logger = require('./logger');

const {
  NODE_SETTINGS: { portNumber },
  CONSENT_BASE_PATH
} = require("./config/environment");
const app = express();
app.use(morgan('tiny',{stream: logger.stream}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const authMiddleware = require('./middleware/authMiddleware'); 
app.use(authMiddleware);
app.use(CONSENT_BASE_PATH, router);
app.listen(portNumber, () => {
  console.log(`App running on port ${portNumber}`);
  logger.log(
    "info",
    "App",
    {
      message: `APP running on port ${portNumber}`
    }
  );
});

module.exports = app;
