let { resetSingleApp } = require("../models/reset-single-app.model");
module.exports = (req, res) => {
  let auth_header = req.header("X-Auth-Header");
  let app_id = req.header("X-App-Id");
  if (!app_id || !auth_header) {
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  return resetSingleApp(app_id, auth_header, (message, status) => {
    return res.status(status).send(message);
  });
};
