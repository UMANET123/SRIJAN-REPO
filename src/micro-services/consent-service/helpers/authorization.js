const {
   CONSENT_KEYS: { consent_client_id, consent_secret_message }
} = require("../config/environment");

/**
 * Function will verify token passed and
 * Return true and false
 * @param {string} token token in string
 */
function verifyConsentToken(token) {
    let decodedString = ''
    try {
    decodedString = getDecodedString(token);
    }catch(err) {
      return false;
    }
    let decodedStringArray = decodedString.split(":");
    if(decodedStringArray[0] === consent_client_id && decodedStringArray[1] === consent_secret_message)
      return true;
    else 
      return false;
  }

  //  get string from header value
function getDecodedString(token) {
  let buff = new Buffer(token, 'base64');
  let decodedString = buff.toString('ascii');
  return decodedString;
}

/**
 * Function will decode the header token passed and
 * Return string
 * @param {string} clientID token in string
 * @param {string} clientSecret token in string
 */
function getAuthorizationHeader(clientID, clientSecret) {
  let encodedData = Buffer.from(clientID + ":" + clientSecret).toString(
    "base64"
  );
  return `Basic ${encodedData}`;
}
  
  module.exports =  { 
    verifyConsentToken,
    getDecodedString,
    getAuthorizationHeader
  };