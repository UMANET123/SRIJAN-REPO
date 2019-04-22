const axios = require("axios");
const {
  CONSENT_KEYS: { consent_client_id, consent_secret_message }
} = require("../config/environment");
const { verifyUser } = require("./auth.model");

const getServiceResolvedUrl = require("../helpers/get-service-resolved-url");
const { getAuthorizationHeader } = require("../helpers/authorization");

/**
 * Checks if a user app is blacklisted
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {Function} callback
 * @returns {Function} returns callback with boolean value
 */
module.exports = function(msisdn, app_id) {
  let serviceHost = process.env.CONSENT_SERVICE_HOST;
  return new Promise(async (resolve, reject) => {
    try {
      let serviceUrl = await getServiceResolvedUrl(serviceHost);
      verifyUser(msisdn, null, async response => {
        if (response && response.subscriber_id) {
          //  do a query to check blacklist api with uuid and msisdn
          let reqUrl = `${serviceUrl}/blacklist/${
            response.subscriber_id
          }/${app_id}`;
          try {
            let { data } = await axios.get(reqUrl, {
              headers: {
                Authorization: getAuthorizationHeader(
                  consent_client_id,
                  consent_secret_message
                )
              }
            });
            console.log(data);
            if (data) return resolve(true);
          } catch (err) {
            return reject(err);
          }
        }
        return resolve(false);
      });
    } catch (err) {
      return reject(err);
    }
  });
};
