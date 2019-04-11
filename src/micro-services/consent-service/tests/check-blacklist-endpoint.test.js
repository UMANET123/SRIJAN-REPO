const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);
const CONSENT_CLIENT_ID = 'consentjshdkjhas8sdandsakdadkad23';
const CONSENT_CLIENT_SECRET = 'secretmessageconsenthgjgdsadb4343';
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(CONSENT_CLIENT_ID, CONSENT_CLIENT_SECRET);
const endpoint =
  "/subscriber/v1/blacklist/e73216f434e325d7f687260c2c272cd6/d23a47af-8a4d-4182-ae86-4f57ac15b15a";
describe(`Testing Response Code for ${endpoint}`, () => {
  it(`Should Return Response Code  200 or 204 GET Check Blacklist`, done => {
    chai
      .request(app)
      .get(endpoint)
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.be.oneOf([200, 204]);
        if (res.statusCode == 200) {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("is_blacklisted");
          expect(res.body.is_blacklisted).to.be.a("boolean");
        }
        done();
      });
  });
  it(`Should Return Response Code  404 without app_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/blacklist/e73216f434e325d7f687260c2c272cd6")
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
  it(`Should Return Response Code  404 without subscriber_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/blacklist/d23a47af-8a4d-4182-ae86-4f57ac15b15a")
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
