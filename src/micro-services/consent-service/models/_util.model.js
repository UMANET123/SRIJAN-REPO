/* jshint esversion:6 */

const { AppMetaData } = require("../config/models");
const logger = require("../logger");
// const pool = require("../config/db");
/**
 *
 *@param {string} app_id App Id
 *@param {string} developer_id Developer Id
 *@param {string} appname App Name
 *@param {Date} created Created Date
 *@param {function} callback Callback Function
 *@param {string} short_description App short description
 *@param {string} long_description App long description
 *@param {string} developer_name Developer Name

 *
 * It will findOrCreate App Meta Data For a Consent Create Request
 */
function createAppMetaData(
  app_id,
  developer_id,
  appname,
  created,
  consent_expiry_local,
  callback,
  short_description,
  long_description,
  developer_name,
  consent_expiry_global
) {
  //  create app meta transaction
  //  findOrCreate app meta data
  //  find uuid/subscriber_id by phone number/msisdn
  return AppMetaData.findOne({
    where: { app_id, developer_id, appname },
    attributes: ["app_id"]
  })
    .then(app => {
      if (!app) {
        //  app is not created
        // create an app
        // assign 500 for internal server error/ network error
        return AppMetaData.create({
          app_id,
          developer_id,
          appname,
          created,
          short_description,
          long_description,
          developer_name,
          consent_expiry_local
        })
          .then(() => callback(true))
          .catch(() => {
            logger.log(
              "error",
              "_utilModel:CreateAppMetaData:Consent.Create:InternalServerError",
              {
                message: JSON.stringify({
                  app_id,
                  developer_id,
                  appname,
                  created,
                  short_description,
                  long_description,
                  developer_name,
                  consent_expiry_local
                })
              }
            );
            return callback(500);
          });
      }
      return callback(true);
    })
    .catch(error => {
      logger.log(
        "error",
        "_utilModel:CreateAppMetaData:Consent.findOne:InternalServerError",
        {
          message: JSON.stringify({ app_id, developer_id, appname })
        }
      );
      logger.log(
        "error",
        "_utilModel:CreateAppMetaData:Consent.findOne:InternalServerError",
        {
          message: `${error}`
        }
      );
      return callback(500);
    });
}

module.exports = { createAppMetaData };
