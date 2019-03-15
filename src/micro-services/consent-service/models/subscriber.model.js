/* jshint esversion:6 */
const sequelize = require("../config/orm.database");
// const pool = require("../config/db");
//  get subscriber apps
/**
 *
 *
 * @param {string} subscriber_id Subscriber ID
 * @param {string} appname appname Optional
 * @param {function} callback Callback Function
 * @returns {function} callback Callback Function
 *
 * GetSubscriberApp method returns callback with
 *  array of appnames
 */
function getSubscriberApps(subscriber_id, appname, callback) {
  //  get appname from subscribers apps
  //  join subscriber_consent and apps_metdata table
  //  check with  valid subsriber_consent records only
  let queryToRun = `SELECT appname FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid= :uuid and status= :status and scopes IS NOT null`;
  let replacements = { uuid: subscriber_id, status: 0 };
  if (appname) {
    queryToRun = `${queryToRun} and lower(appname) ILIKE :appname`;
    replacements.appname = `%${appname}%`;
  }

  sequelize
    .query(queryToRun, { replacements, type: sequelize.QueryTypes.SELECT })
    .then(app => {
      console.log(app);
      let appArray = app.map(({ appname }) => appname);
      callback(200, { appname: appArray });
    })
    .catch(e => console.log(e));
}

module.exports = { getSubscriberApps };
