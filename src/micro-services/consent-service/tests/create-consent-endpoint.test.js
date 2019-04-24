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

const endpoint = "/subscriber/v1/consent";
const contentType = "application/json";

describe("Testing Create Consent API Endpoint", () => {
  describe(`Testing Response Code for ${endpoint}`, () => {
    it(`Should Return Response Code 201 or 302 or 200 or 403 for create consent POST`, done => {
      let data = JSON.stringify({
        subscriber_id: "e73216f434e325d7f687260c2c272cd6",
        app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
        developer_id: "010bdc29-b409-4879-838c-310f363379c7",
        scopes: ["sms", "location"],
        appname: "Weather App"
      });
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(data)
        .end((err, res) => {
          //   console.log(res.body);
          expect(res.statusCode).to.be.oneOf([201, 200, 302, 403]);
          done();
        });
    });
  });
  describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
    it("Should Reject  for no subscriber_id with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            app_id: "e2274bcab5aa452c7ae03165",
            developer_id: "a0040a18e227",
            scopes: ["sms", "location"],
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
            appname: "Weather App"
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
    it("Should Reject  for no appname with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
            app_id: "e2274bcab5aa452c7ae03165",
            developer_id: "a0040a18e227",
            scopes: ["sms", "location"],
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN"
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
    it("Should Reject  for no scopes with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
            app_id: "e2274bcab5aa452c7ae03165",
            developer_id: "a0040a18e227",
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
            appname: "Weather App"
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
    it("Should Reject  for no app_id with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
            developer_id: "a0040a18e227",
            scopes: ["sms", "location"],
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
            appname: "Weather App"
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
    it("Should Reject  for no developer_id with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            app_id: "e2274bcab5aa452c7ae03165",
            developer_id: "a0040a18e227",
            scopes: ["sms", "location"],
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
            appname: "Weather App"
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
    //we have got status 302 (and location heder is given) as record already exists that's why it failing 
    it(`Testing endpoint Request ${endpoint} for invalid transaction_id`, done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type(contentType)
        .send(
          JSON.stringify({
            subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
            app_id: "e2274bcab5aa452c7ae03165",
            developer_id: "a0040a18e227",
            scopes: ["sms", "location"],
            access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
            appname: "Weather App"
          })
        )
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property(
            "status",
            "Transaction id is not valid"
          );
          done();
        });
    });
  });
});
