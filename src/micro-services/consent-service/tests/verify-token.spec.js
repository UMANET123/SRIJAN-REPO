const { verifyConsentToken, getAuthorizationHeader } = require("../helpers/authorization");
var chai = require('chai');
const {
    CONSENT_KEYS: { consent_client_id, consent_secret_message }
  } = require("../config/environment");
  const CONSENT_CLIENT_ID = consent_client_id;
  const CONSENT_CLIENT_SECRET = consent_secret_message;
describe('Testing Token Verification',()=>{
    it('It should return true for correct token',(done)=>{
        var token = getAuthorizationHeader(CONSENT_CLIENT_ID, CONSENT_CLIENT_SECRET);
        token = token.substring(6, token.length);
        chai.expect(verifyConsentToken(token)).to.equal(true);
        done();
    })
    it('It should return false for incorrect token',(done)=>{
        var token = getAuthorizationHeader('asdasdadsad', 'asdasdasdasdsad');
        token = token.substring(6, token.length);
        chai.expect(verifyConsentToken(token)).to.equal(false);
        done();
    })
})

