
const pool = require('../config/db');
const updatePhoneNo = require('../helpers/mobile-number.modify');


function verifyUser(phone_no, uuid, callback) {
    (async () => {
        const client = await pool.connect();
        try {
            let query = null;
            // for  phone no find uuid
            if (phone_no) {
                phone_no = updatePhoneNo(phone_no);
                query = `SELECT uuid FROM subscriber_data_mask where phone_no='${phone_no}'`;
            } else {
                 // find phone_no
                query= `SELECT phone_no FROM subscriber_data_mask where uuid='${uuid}'`;
            }
          const res = await client.query(query);
          if (res.rows && res.rows[0]) {
            callback(res.rows[0], 200);
          } else {
            callback(null, 204);
          }
        return;
        } finally {
          client.release();
        }
      })().catch(e => 
        {
          console.log(e.stack)
          callback({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          }, 404);
        });
}



module.exports = { verifyUser };
