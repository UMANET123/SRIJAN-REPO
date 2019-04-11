const { verifyAuthToken, getAuthorizationHeader } = require("../../helpers/authorization");
var chai = require('chai');
let AUTH_CLIENT_ID = 'authjshdkjhas8sdandsakdadkad23';
let AUTH_CLIENT_SECRET = 'secretmessageauthhgjgdsadb4343';
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

