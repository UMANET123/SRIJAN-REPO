/* jshint esversion:6 */

const { AppMetaData } = require("../config/models");
const pool = require("../config/db");
/**
 *@param args [] Arguments as array
 *
 * - {string} app_id App Id
 * - {string} developer_id Developer Id
 * - {string} appname App Name
 * - {Date} created Created Date
 * - {string} short_description App short description
 * - {string} long_description App long description
 * - {string} developer_name Developer Name
 * - {function} callback Callback Function
 *
 * It will findOrCreate App Meta Data For a Consent Create Request
 */
function createAppMetaData(...args) {
  let [
    {
      app_id,
      developer_id,
      appname,
      created,
      short_description,
      long_description,
      developer_name
    },
    callback
  ] = args;
  //  create app meta transaction
  //  findOrCreate app meta data
  //  find uuid/subscriber_id by phone number/msisdn
  AppMetaData.findOne({
    where: { app_id, developer_id, appname },
    attributes: ["app_id"]
  }).then(app => {
    if (app && app.app_id) {
      //  app is not created
      // create an app
      console.log("Need to created app meta");
      AppMetaData.create({
        app_id,
        developer_id,
        appname,
        created,
        short_description,
        long_description,
        developer_name
      }).then(() => {
        console.log("app meta created and now callback");
        return callback(true);
      });
    }
    console.log("app meta callback called");
    return callback(true);
  });
}

module.exports = { createAppMetaData };
