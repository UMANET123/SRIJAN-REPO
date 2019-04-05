const { SubscriberConsent } = require("../config/models");
/**
 *
 * Status Codes:  -1, 0, 1
 * -1 = Always Skip
 * 0 = Allow Skip
 * 1 = Always Ask
 */
/**
 * This function will return whether the application can skip consent or not,
 * based on certain factors as follows:
 * -status code
 * -expiry
 * -scopes match or mismatch
 * @param {Object} req
 * @param {Function} callback
 * @returns {callback({status: boolean}, statusCode)}
 * Will return callback with status object and http status code
 */

function skipConsent(req, callback) {
  // PLEASE NOT `subscriber_id` is the same as `uuid`
  let { uuid, app_id } = req.params;
  let { expiry, scopes, developer_id, status } = req.query;
  let returnStatus = false;
  /**
   * Parse Scopes only if they exist
   */
  if(scopes) scopes = JSON.parse(scopes).sort();
  if (status == -1) {
    returnStatus = true;
    return callback({ status: returnStatus }, 200);
  } else if (status == 1) {
    returnStatus = false;
    return callback({ status: returnStatus }, 200);
  } else {
    SubscriberConsent.findOne({
      where: {
        uuid: uuid,
        app_id: app_id,
        developer_id: developer_id
      },
      attributes: [
        "uuid",
        "app_id",
        "developer_id",
        "access_token",
        "scopes",
        "status"
      ]
    }).then(result => {
      if (result) {
        if (scopes) {
          //Scopes from the database record
          resultScopes = result.scopes.map(scope => scope.toLowerCase());
          if (resultScopes.length < scopes.length) {
            returnStatus = false;
          } else {
            /**
             * Setting the returnStatus = true, incase scopes sent is the subset of
             * resultScopes ( Scopes returned from db)
             * During the map, if any scope is found out of place, returnStatus is set to false
             */
            returnStatus = true;
            scopes.map(scope => {
              if (!resultScopes.includes(scope.toLowerCase())) {
                returnStatus = false;
              }
            });
          }
        } else {
          // Skip if no scopes are present
          returnStatus = true;
        }
      } else {
        // Don't skip if the record is not present
        returnStatus = false;
      }
    }).finally(()=>{
      return callback({ status: returnStatus }, 200);
    });
    
    
  }
}

module.exports = { skipConsent };
