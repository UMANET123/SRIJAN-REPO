let { resetAllApps } = require("../models/reset-all-apps.model")
module.exports = (req, res) => {
  let auth_header = req.header("X-Auth-Header");
  if (!auth_header) {
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  return resetAllApps(auth_header, (message, status) => {
    return res.status(status).send(message);
  });
};
