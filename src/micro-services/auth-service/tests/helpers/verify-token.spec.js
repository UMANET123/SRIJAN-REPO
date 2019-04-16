const { verifyAuthToken, getAuthorizationHeader } = require("../../helpers/authorization");
var chai = require('chai');
const {
    AUTH_KEYS: { auth_client_id, auth_secret_message }
  } = require("../../config/environment");
let AUTH_CLIENT_ID = auth_client_id;
let AUTH_CLIENT_SECRET = auth_secret_message;
describe('Testing Token Verification',()=>{
    it('It should return true for correct token',(done)=>{
        var token = getAuthorizationHeader(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET);
        token = token.substring(6, token.length);
        chai.expect(verifyAuthToken(token)).to.equal(true);
        done();
    })
    it('It should return false for incorrect token',(done)=>{
        var token = getAuthorizationHeader('asdasdadsad', 'asdasdasdasdsad');
        token = token.substring(6, token.length);
        chai.expect(verifyAuthToken(token)).to.equal(false);
        done();
    })
})

