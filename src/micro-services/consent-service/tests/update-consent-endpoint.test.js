const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);

const endpoint = "/subscriber/v1/consent";
const contentType = "application/json";

describe("Testing Update Consent API Endpoint", () => {
  describe(`Testing Response Code for ${endpoint}`, () => {
    it(`Should Return Response Code  200 or 403 for update consent PUT`, done => {
      let data = JSON.stringify({
        subscriber_id: "e73216f434e325d7f687260c2c272cd6",
        transaction_id: "0fd8d00997a797c63ef4f5fe8e85a772",
        app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
        developer_id: "010bdc29-b409-4879-838c-310f363379c7",
        scopes: ["sms", "location"],
        appname: "Weather App",
        access_token: "fgf##Ddsds"
      });
      chai
        .request(app)
        .put(endpoint)
        .type(contentType)
        .send(data)
        .end((err, res) => {
          // console.log({ body: res.body });
          expect(res.statusCode).to.to.be.oneOf([200, 403]);
          expect(err).to.equal(null);
          expect(res.body).to.be.an("object");
          switch (res.statusCode) {
            case 200:
              expect(res.body).to.have.property("old_token");
              expect(res.body).to.have.property("old_token_value");
              if (res.body.old_token) {
                expect(res.body.old_token_value).to.not.equal("");
              } else {
                expect(res.body.old_token_value).to.equal("");
              }
              break;
            case 403:
              expect(res.body).to.have.property(
                "status",
                "Transaction id is not valid"
              );
              break;
          }

          done();
        });
    });
  });

  describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
    it("Should Reject  for no transaction_id with status code 400", done => {
      chai
        .request(app)
        .put(endpoint)
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
          expect(err).to.equal(null);
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("error_code", "BadRequest");
          expect(res.body).to.have.property("error_message", "Bad Request");
          done();
        });
    });
  });
  it("Should Reject  for no subscriber_id with status code 400", done => {
    chai
      .request(app)
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          app_id: "e2274bcab5aa452c7ae03165",
          developer_id: "a0040a18e227",
          transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
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
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
          app_id: "e2274bcab5aa452c7ae03165",
          developer_id: "a0040a18e227",
          transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
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
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
          app_id: "e2274bcab5aa452c7ae03165",
          developer_id: "a0040a18e227",
          transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
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
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
          transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
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
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          app_id: "e2274bcab5aa452c7ae03165",
          transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
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

  it(`Testing endpoint Request ${endpoint} for invalid transaction_id`, done => {
    chai
      .request(app)
      .put(endpoint)
      .type(contentType)
      .send(
        JSON.stringify({
          subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
          transaction_id: "598a07=sdsdosoehhiudhieuhfdhijcndk",
          app_id: "e2274bcab5aa452c7ae03165",
          developer_id: "a0040a18e227",
          scopes: ["sms", "location"],
          access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
          appname: "Weather App"
        })
      )
      .end(function(err, res) {
        expect(err).to.equal(null);
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
