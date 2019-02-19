const pool = require('../config/db');
//  get subscriber apps
function getSubscriberApps(subscriber_id, appname, callback) {
    (async () => {
        const client = await pool.connect();
        try {
            let record = null;
            if (appname) {
                //  get all whitelisted apps of a subscriber with appname enterred
              record = await client.query("SELECT appname FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) and status=($2) and scopes IS NOT null and lower(appname) Like ($3)", [subscriber_id, 0, `%${appname.toLowerCase()}%`]);
            } else {
                //  get all whitelisted apps of a subscriber without appname
              record = await client.query("SELECT appname FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) and status=($2) and scopes IS NOT null", [subscriber_id, 0]);
            }
            if (record.rows[0]) {
              let appArray = record.rows.map(({appname}) => appname);
              callback(200, { "appname": appArray});  
            } else {
              callback(204, {"status": "Record Not Found"});
            }
                
        } finally {
          client.release();
        }
      })().catch(e => {
          console.log(e.stack)
          throw e;
        });
}

module.exports = {getSubscriberApps};