const { verifyConsentToken, getAuthorizationHeader } = require("../helpers/authorization");
var chai = require('chai');
let CONSENT_CLIENT_ID = 'consentjshdkjhas8sdandsakdadkad23';
let CONSENT_CLIENT_SECRET = 'secretmessageconsenthgjgdsadb4343';
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

