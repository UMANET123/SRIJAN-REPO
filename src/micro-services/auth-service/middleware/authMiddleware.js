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
        error_code: 'Forbidden',
        error_message: 'access token not found'
      });
    } else {
      if (authHeader.startsWith("Basic ")){ 
        authToken = authHeader.substring(6, authHeader.length);
      } else {
        return res.status(401).send({
          error_code: 'Unauthorized',
          error_message: 'Subscriber is not authorized to make the request'
        })
      }
      if (authToken && verifyAuthToken(authToken)) {
        next();
      } else {
        return res.status(401).send({
          error_code: 'Unauthorized',
          error_message: 'Subscriber is not authorized to make the request'
        })
      }
    }
  }
}