const { verifyAuthToken } = require("../helpers/authorization");
const { AUTHENTICATION_ACTIVE } = require("../config/environment");

module.exports = function (req, res, next) {
  if (AUTHENTICATION_ACTIVE == "false"){
    next();
  } else { 
    const authHeader = req.headers.authorization;
    let authToken = '';
    if (!authHeader) {
      return res.status(403).send({
        error: 'Forbidden'
      });
    } else {
      if (authHeader.startsWith("Basic ")){ 
        authToken = authHeader.substring(6, authHeader.length);
      } else {
        return res.status(401).send({
          error: 'UnAuthorized'
        })
      }
      if (authToken && verifyAuthToken(authToken)) {
        next();
      } else {
        return res.status(401).send({
          error: 'UnAuthorized'
        })
      }
    }
  }
}