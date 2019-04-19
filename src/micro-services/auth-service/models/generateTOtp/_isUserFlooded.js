const floodControlTimeValidity = require("./_util");
const { FloodControl } = require("../../config/models");
const { BLOCK_USER_LIMIT } = require("./_constants");

module.exports = function(uuid) {
  //  query to find the user
  return new Promise(async (resolve, reject) => {
    console.log("*** UUID : ", uuid);
    try {
      //  find OR create Flood controll record
      const [floodControl, created] = await FloodControl.findOrCreate({
        where: { uuid: uuid },
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
          let difference = floodControlTimeValidity(
            new Date(floodControl.created_at),
            new Date()
          );
          //  check time difference with block limit time
          console.log("**** DIFFERENCE : ", difference);
          console.log(
            "**** DIFFERENCE VALID? : ",
            difference >= BLOCK_USER_LIMIT
          );
          //  time difference is > block user limit
          if (difference >= BLOCK_USER_LIMIT) {
            // unblock it / reset the record
            //  delete and create a new record with same uuid
            await FloodControl.destroy({
              where: {
                uuid
              }
            });
            await FloodControl.create({
              uuid
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
