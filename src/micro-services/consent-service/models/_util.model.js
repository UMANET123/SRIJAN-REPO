/* jshint esversion:6 */

const { AppMetaData } = require("../config/models");
const pool = require("../config/db");
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
  callback,
  short_description,
  long_description,
  developer_name
) {
  //  create app meta transaction
  //  findOrCreate app meta data
  //  find uuid/subscriber_id by phone number/msisdn
  return AppMetaData.findOne({
    where: { app_id, developer_id, appname },
    attributes: ["app_id"]
  })
    .then(app => {
      console.log(app);
      if (!app) {
        //  app is not created
        // create an app
        console.log("Need to created app meta");
        return AppMetaData.create({
          app_id,
          developer_id,
          appname,
          created,
          short_description,
          long_description,
          developer_name
        })
          .then(() => {
            console.log("app meta created and now callback");
            return callback(true);
          })
          .catch(e => console.log(e));
      }
      // } else {
      console.log("app meta callback called");
      return callback(true);
    })
    .catch(e => console.log(e));
}

module.exports = { createAppMetaData };
