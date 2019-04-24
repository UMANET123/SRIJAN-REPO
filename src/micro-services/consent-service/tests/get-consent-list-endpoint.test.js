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

const endpoint = "/subscriber/v1/consent/e73216f434e325d7f687260c2c272cd6/list";
describe(`Testing Response Code for ${endpoint}`, () => {
  it(`Should Return Response Code  200  GET Consent List`, done => {
    chai
      .request(app)
      .get(endpoint)
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("resultcount");
        expect(res.body).to.have.property("apps");
        // check for result data > 0 case
        if (res.body.resultcount > 0) {
          expect(res.body).to.have.property("page");
          expect(res.body).to.have.property("limit");
          expect(res.body.apps.length).to.be.above(0);
        }
        done();
      });
  });
  it(`Should Return Response Code  404 without subscriber_id  GET Consent List`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/consent")
      .set({'Authorization': token})
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
