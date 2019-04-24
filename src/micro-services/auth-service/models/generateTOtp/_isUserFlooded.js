const { timeDifferenceInMin } = require("./_util");
const { FloodControl } = require("../../config/models");
const { BLOCK_USER_LIMIT } = require("./_constants");

/**
 *
 * Is User Flooded / Blocked Checking
 * @param {string} uuid Subscriber ID
 * @param {string} app_id App ID
 * @returns {Promise} Boolean in Promise
 */
module.exports = function(uuid, app_id) {
  //  query to find the user
  return new Promise(async (resolve, reject) => {
    console.log("*** UUID : ", uuid);
    try {
      //  find OR create Flood controll record
      const [floodControl, created] = await FloodControl.findOrCreate({
        where: { uuid, app_id },
        attributes: ["status", "created_at"]
      });
      //  for Old Record flood control
      if (!created) {
        //  record already exists
        //  flood control record is blocked === 1 check
        console.log("***** FLOOD CONTROL STATUS : ", floodControl.status);
        // status == 1 == user blocked and need to check time difference
        if (floodControl.status === parseInt(1)) {
          //  check time duration difference
          let difference = timeDifferenceInMin(
            new Date(floodControl.created_at),
            new Date()
          );
          //  check time difference with block limit time
          //  time difference is > block user limit
          if (difference >= BLOCK_USER_LIMIT) {
            // unblock it / reset the record
            //  delete record
            await FloodControl.destroy({
              where: {
                uuid,
                app_id
              }
            });
            // create a new record with same uuid
            await FloodControl.create({
              uuid,
              app_id
            });
            console.log("****  User unblocked ****");
            return resolve(false);
          } else {
            console.log("****  User blocked ****");
            return resolve(true);
          }
        }
      }
      console.log("****  User unblocked ****");
      return resolve(false);
    } catch (err) {
      return reject(err);
    }
  });
};
