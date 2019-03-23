const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);

const endpoint = "/subscriber/v1/blacklist";
const contentType = "application/json";

describe("Testing Create Consent API Endpoint", () => {
  describe(`Testing Response Code for ${endpoint}`, () => {
    it(`Should Return Response Code 201 or 302  for create blacklist POST`, done => {
      let data = JSON.stringify({
        subscriber_id: "e73216f434e325d7f687260c2c272cd6",
        app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
        developer_id: "010bdc29-b409-4879-838c-310f363379c7"
      });
      chai
        .request(app)
        .post(endpoint)
        .type(contentType)
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.be.oneOf([201, 302]);
          if (res.statusCode == 201) {
            expect(res.body).to.have.property("revoked_tokens");
            expect(res.body.revoked_tokens.length).not.equal(0);
          }
          done();
        });
    });
    it(`Should Return Response Code 403 for wrong data  for create blacklist POST`, done => {
      let data = JSON.stringify({
        subscriber_id: "e73216f43",
        app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
        developer_id: "010bdc29-b409-48"
      });
      chai
        .request(app)
        .post(endpoint)
        .type(contentType)
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body).to.have.property("status", "Forbidden");
          done();
        });
    });
  });

  describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
    it("Should Reject  for no subscriber_id in request body with status code 400", done => {
      chai
        .request(app)
        .post(endpoint)
        .type(contentType)
        .send(
          JSON.stringify({
            app_id: "e2274bcab5aa452c7ae03165",
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
  it("Should Reject  for no app_id with status code 400", done => {
    chai
      .request(app)
      .post(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",

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
  it("Should Reject  for no developer_id with status code 400", done => {
    chai
      .request(app)
      .post(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
          app_id: "e2274bcab5aa452c7ae03165"
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
