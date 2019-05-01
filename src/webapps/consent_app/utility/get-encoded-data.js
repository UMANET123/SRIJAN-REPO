const {
  APIGEE_CREDS: { clientID, clientSecret }
} = require("../config/environment");
/**
 *
 * Function will get username , password , encoding format type and
 * return encoded string
 * @param {string} [username=clientID] username any string value Default value is  Client Id
 * @param {string} [password=clientSecret] password any string value Default value is  Client Secret
 * @param {string} [encodeType="base64"] encodeType is string to encode it in a specific format default is base64
 * @returns {string} encodede String
 */

module.exports = (
  username = clientID,
  password = clientSecret,
  encodeType = "base64"
) => Buffer.from(username + ":" + password).toString(encodeType);
