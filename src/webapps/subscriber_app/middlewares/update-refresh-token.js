/* jshint esversion:9 */
const {
  APIGEE_ENDPOINTS: { refreshToken },
  APIGEE_CREDS: { apigeeBaseURL, clientID, clientSecret }
} = require("../config/environment");
const request = require("request");
/**
 *
 *
 * @param {object} req Http Request Object
 * @param {object} res Http Response Object
 * @param {function} next Function It will forward call to next middleware
 * Note: This is a middleware method ,
 * will check if user loging time is in between
 * access token expiry time and refresh token expiry time
 * (access_token_expiry < user total logging time < refresh_token_expiry),
 * it will hit refresh token api and update token and expiry
 */
function checkAndUpdateToken(req, res, next) {
  //  session has access token
  if (req.session.hasOwnProperty("access_token")) {
    //   set user login time
    if (!req.session.hasOwnProperty("login_utc_time")) {
      req.session.login_utc_time = new Date().getTime();
    } else {
      //  let user login time in seconds
      let user_logged_time = Math.floor(
        (new Date().getTime() - req.session.login_utc_time) / 1000
      );
      console.log({ user_logged_time });
      let {
        expires_in,
        refresh_token_expires_in,
        refresh_token,
        access_token
      } = req.session;
      /**
       * local  development start
       */
      //   expires_in = 10 || parseInt(expires_in);
      //   refresh_token_expires_in = 5004 || parseInt(refresh_token_expires_in);
      /**
       * local  development end
       */

      //    convert times to intergers
      expires_in = parseInt(expires_in);
      refresh_token_expires_in = parseInt(refresh_token_expires_in);
      // execute only expire, refresh token validity exists
      /*
       *  check access token time in between access_token expiry
       *  and refresh_token expiry
       */
      console.log({ expires_in, refresh_token_expires_in, user_logged_time });
      if (
        expires_in &&
        refresh_token_expires_in &&
        expires_in <= user_logged_time
      ) {
        /*
         * access token expires
         * check user login time is lesser than ...
         * refresh token
         */
        if (user_logged_time < refresh_token_expires_in) {
          //   hit the api
          console.log("Refresh token API hit");
          //    get request parameters
          let req_options = getReqOptions(refresh_token);

          request(req_options, (err, response, body) => {
            if (err) throw Error(err);
            //  for Suceess response update timer, tokens
            if (response.statusCode === 201) {
              //    parse response body
              body = JSON.parse(body);
              //    updating sessions
              console.log({ oldSession: req.session, newSession: body });
              req.session.access_token = body.access_token;
              req.session.expires_in = body.expires_in;
              req.session.refresh_token = body.refresh_token;
              req.session.refresh_token_expires_in =
                body.refresh_token_expires_in;
              // updating sessions done
              console.log({ UpdatedSession: req.session });
            }
          });
        }
      }
    }
  }
  next();
}

/**
 *
 *
 * @param {string} refresh_token Refresh Token for Authorization
 * @returns {object} Parameter Object  Request Option will be passed for API call
 */
function getReqOptions(refresh_token) {
  return {
    method: "POST",
    url: `${apigeeBaseURL}/${refreshToken}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: getAuthorizationHeader(clientID, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    }
  };
}
//  get basic auth header string value
function getAuthorizationHeader(clientID, clientSecret) {
  let encodedData = Buffer.from(clientID + ":" + clientSecret).toString(
    "base64"
  );
  return `Basic ${encodedData}`;
}

module.exports = { checkAndUpdateToken };
