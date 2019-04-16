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

const endpoint = "/subscriber/v1/revoke/e73216f434e325d7f687260c2c272cd6";
const contentType = "application/json";

describe("Testing Update Consent API Endpoint", () => {
  describe(`Testing Response Code for ${endpoint}`, () => {
    it(`Should Return Response Code  201 or 403 for revoke single consent PUT`, done => {
      let data = JSON.stringify({
        app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
        developer_id: "010bdc29-b409-4879-838c-310f363379c7"
      });
      chai
        .request(app)
        .put(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(data)
        .end((err, res) => {
          //   console.log({ body: res.body });
          expect(res.statusCode).to.to.be.oneOf([201, 403]);
          expect(err).to.equal(null);
          expect(res.body).to.be.an("object");
          switch (res.statusCode) {
            case 201:
              expect(res.body).to.have.property("revoked_tokens");
              expect(res.body.revoked_tokens).to.be.an("array");
              expect(res.body.revoked_tokens.length).to.be.above(0);
              break;
            case 403:
              expect(res.body).to.have.property("status", "Forbidden");
              break;
          }

          done();
        });
    });
  });

  describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
    it("Should Reject  for no subscrber_id in reqeust path parameter with status code 400", done => {
      chai
        .request(app)
        .put("/subscriber/v1/revoke")
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
            developer_id: "010bdc29-b409-4879-838c-310f363379c7"
          })
        )
        .end(function(err, res) {
          expect(err).to.equal(null);
          expect(res).to.have.status(404);
          done();
        });
    });
  });
  it("Should Reject  for no app_id in request body with status code 400", done => {
    chai
      .request(app)
      .put(endpoint)
      .set({'Authorization': token})
      .type(contentType)
      .send(
        JSON.stringify({
          developer_id: "a0040a18e227"
        })
      )
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error_code", "BadRequest");
        expect(res.body).to.have.property("error_message", "Bad Request");
        done();
      });
  });
  it("Should Reject  for no developer_id in request body with status code 400", done => {
    chai
      .request(app)
      .put(endpoint)
      .set({'Authorization': token})
      .type(contentType)
      .send(
        JSON.stringify({
          developer_id: "a0040a18e227"
        })
      )
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error_code", "BadRequest");
        expect(res.body).to.have.property("error_message", "Bad Request");
        done();
      });
  });
});
