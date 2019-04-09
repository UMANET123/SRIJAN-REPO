/* jshint esversion:6 */
const dns = require("dns");
/**
 *
 *
 * @param {string} serviceHost Micro Service HostName
 * @param {string} serviceEndpointUri Service Endpint URI i.e. /subscriber/v1
 * @param {string} serviceDefaultPath Micro Service default path set in Enviroment
 * @param {string} protocolStr (Optional) Protocol string like http:// (default) or https://
 * @returns {object} Promise containing
 *   - success will return resolved url in the promise
 *   - error will return error go to catch block
 * Note: How to use this function
 * snippet `getServiceResolvedUrl(
        "consentservice",
        "/subscriber/v1",
        "http://consentms:3002/subscriber/v1"
      ).then(url => YOUR CODE).catch(e => ERROR HANDLER);` 
 */

function getServiceResolvedUrl(
  serviceHost,
  serviceEndpointUri,
  serviceDefaultPath,
  protocolStr = "http://"
) {
  return new Promise((resolve, reject) => {
    if (!serviceHost || !serviceDefaultPath || !serviceEndpointUri)
      return reject(
        Error(
          "(serviceHost,serviceEndpointUri,serviceDefaultPath) one of them are not passed"
        )
      );
    //  hit for dns service discovery with host
    dns.resolveSrv(serviceHost, (err, addresses) => {
      //    reject the promise if error occurs
      if (err) return reject(err);
      //  shift array index and return object
      addresses = addresses.shift();
      //    check addresses contains valid information
      if (
        addresses &&
        addresses.hasOwnProperty("name") &&
        addresses.hasOwnProperty("port")
      ) {
        let resolvedPath =
          protocolStr +
          addresses.name +
          ":" +
          addresses.port +
          serviceEndpointUri;
        return resolve(resolvedPath);
      } else {
        // if data retrieved is not valid resolve default value
        return resolve(serviceDefaultPath);
      }
    });
  });
}
/*
sample code block
getServiceResolvedUrl(
  "consentservice",
  "/subscriber/v1",
  "http://consentms:3002/subscriber/v1"
)
  .then(url => console.log(url))
  .catch(e => console.log(e));
*/
module.exports = getServiceResolvedUrl;
