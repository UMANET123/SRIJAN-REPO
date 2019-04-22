const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);
const {
  CONSENT_KEYS: { consent_client_id, consent_secret_message }
} = require("../config/environment");
const CONSENT_CLIENT_ID = consent_client_id;
const CONSENT_CLIENT_SECRET = consent_secret_message;
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(CONSENT_CLIENT_ID, CONSENT_CLIENT_SECRET);

const endpoint = "/subscriber/v1/app/search/e73216f434e325d7f687260c2c272cd6";
describe(`Testing Response Code for ${endpoint}`, () => {
  it(`Should Return Response Code  200  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get(endpoint)
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("appname");
        expect(res.body.appname).to.be.an("array");
        done();
      });
  });
  it(`Should Return no apps for invalid subscriber id GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/app/search/absdasds3jzzzzzz")
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body.appname).to.be.an("array");
        expect(res.body.appname.length).to.equal(0);
        done();
      });
  });
  it(`Should Return Response Code  404 without subscriber_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/app/search")
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
