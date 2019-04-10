/* jshint esversion:6 */
const dns = require("dns");
/**
 *
 *
 * @param {string} serviceHost (Optional) Micro Service HostName
 * @param {string} serviceEndpointUri (Optional)  Service Endpint URI i.e. /subscriber/v1
 * @param {string} serviceDefaultPath (Optional)  Micro Service default path set in Enviroment
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
  serviceHost = process.env.CONSENT_SERVICE_HOST,
  serviceEndpointUri = process.env.CONSENT_SERVICE_ENDPOINT_URI,
  serviceDefaultPath = process.env.CONSENT_SERVICE_BASEPATH,
  protocolStr = "http://"
) {
  return new Promise((resolve, reject) => {
    // TODO: Need to add a mapping logic for service Endpoint, DefaultPath, Host
    if (!serviceHost || !serviceDefaultPath || !serviceEndpointUri)
      return reject(
        Error(
          "(serviceHost,serviceEndpointUri,serviceDefaultPath) one of them are not passed"
        )
      );
    if (serviceHost == "consentms") {
      return resolve(serviceDefaultPath);
    }
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
 * Note sample code block
 * example 1:
 * getServiceResolvedUrl(
 *)
 *  .then(url => console.log(url))
 *  .catch(e => console.log(e));
 * example 2 with params:
 * getServiceResolvedUrl(
 *  "consentservice",
 *  "/subscriber/v1",
 *  "http://consentms:3002/subscriber/v1"
 * )
 *  .then(url => console.log(url))
 *  .catch(e => console.log(e));
 */
module.exports = getServiceResolvedUrl;
