const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");

const { expect } = chai;
chai.use(chaiHTTP);

const {
  CONSENT_KEYS: { consent_client_id, consent_secret_message }
} = require("../config/environment");
const CONSENT_CLIENT_ID = consent_client_id;
const CONSENT_CLIENT_SECRET = consent_secret_message;
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(CONSENT_CLIENT_ID, CONSENT_CLIENT_SECRET);
const Authorization = { Authorization: token };

const endpoints = {
  createConsent: function() {
    return "/subscriber/v1/consent";
  },
  updateConsent: function() {
    return "/subscriber/v1/consent";
  },
  resetConsent: function() {
    return "/subscriber/v1/reset/app/single";
  },
  skipConsent: function(subscriber_id, app_id) {
    return `/subscriber/v1/app/consent_bypass/${subscriber_id}/${app_id}`;
  }
};

let generateHash = function() {
  let randomString = Math.random()
    .toString(36)
    .substring(7);
  return require("crypto")
    .createHash("md5")
    .update(randomString)
    .digest("hex");
};

describe("Testing single app consent reset", () => {
  /**
   * This test should go through the happy flow
   * - Create a consent
   * - Update the access token
   * - Check bypass for true
   * - reset app consent
   * - Check bypass for false
   */

  it("Should Reset consents of an App for a user", done => {
    /**
     * This should go through the flow where a consent is created after an app consent is reset
     * - Create Consent
     * - Update Access token
     * - Reset Consent for app
     * - Create a new consent
     * - Consnet Skip should return true for the new consent
     */
    let subscriber_id = generateHash();
    console.log("Subscriber ID : ", subscriber_id);
    let subscriber_id_2 = generateHash();
    console.log("Subscriber ID 2 : ", subscriber_id_2);
    let app_id = generateHash();
    console.log("App ID : ", app_id);
    let developer_id = generateHash();
    let transaction_id = generateHash();
    let access_token = generateHash();
    let scopes = ["CONTACT", "SMS", "LOCATION"];
    let appname = "Testcase FIXED_EXPIRY";
    let consent_type = "FIXED_EXPIRY";
    let date = new Date();
    date.setDate(date.getDate() + 10);
    let consent_expiry = date.toISOString();

    let createBody = {
      subscriber_id,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      consent_type,
      consent_expiry
    };

    let createBody_2 = {
      subscriber_id: subscriber_id_2,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      consent_type,
      consent_expiry
    };

    let updateBody = {
      subscriber_id,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      access_token
    };

    let updateBody_2 = {
      subscriber_id: subscriber_id_2,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      access_token
    };

    setTimeout(() => {
      chai
        .request(app)
        .post(endpoints.createConsent())
        .set(Authorization)
        .send(createBody)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          chai
            .request(app)
            .put(endpoints.updateConsent())
            .set(Authorization)
            .send(updateBody)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              setTimeout(() => {
                chai
                  .request(app)
                  .get(
                    `${endpoints.skipConsent(
                      subscriber_id,
                      app_id
                    )}?scopes=${scopes.join(" ")}`
                  )
                  .set(Authorization)
                  .end((err, res) => {
                    console.log(res.body);
                    expect(res.statusCode).to.equal(200);
                    expect(res.body.status).to.equal(true);
                    chai
                      .request(app)
                      .post(endpoints.resetConsent())
                      .set({ "X-Auth-Header": "12345678", "X-App-Id": app_id })
                      .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        setTimeout(() => {
                          chai
                            .request(app)
                            .post(endpoints.createConsent())
                            .set(Authorization)
                            .send(createBody_2)
                            .end((err, res) => {
                              expect(res.statusCode).to.equal(201);
                              chai
                                .request(app)
                                .put(endpoints.updateConsent())
                                .set(Authorization)
                                .send(updateBody_2)
                                .end((err, res) => {
                                  expect(res.statusCode).to.equal(200);
                                  console.log("I REACH HERE");
                                  console.log(res.body);
                                  chai
                                    .request(app)
                                    .get(
                                      `${endpoints.skipConsent(
                                        subscriber_id_2,
                                        app_id
                                      )}?scopes=${scopes.join(" ")}`
                                    )
                                    .set(Authorization)
                                    .end((err, res) => {
                                      expect(res.statusCode).to.equal(200);
                                      expect(res.body.status).to.equal(true);
                                      done();
                                    });
                                });
                            });
                        }, 1000);
                      });
                  });
              }, 500);
            });
        });
    }, 500);
  });

  it("Should Allow a consent created after an app has been reset", done => {
    let subscriber_id = generateHash();
    console.log("Subscriber ID : ", subscriber_id);
    let app_id = generateHash();
    console.log("App ID : ", app_id);
    let developer_id = generateHash();
    let transaction_id = generateHash();
    let access_token = generateHash();
    let scopes = ["CONTACT", "SMS", "LOCATION"];
    let appname = "Testcase FIXED_EXPIRY";
    let consent_type = "FIXED_EXPIRY";
    let date = new Date();
    date.setDate(date.getDate() + 10);
    let consent_expiry = date.toISOString();

    let createBody = {
      subscriber_id,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      consent_type,
      consent_expiry
    };

    let updateBody = {
      subscriber_id,
      transaction_id,
      app_id,
      developer_id,
      scopes,
      appname,
      access_token
    };

    setTimeout(() => {
      chai
        .request(app)
        .post(endpoints.createConsent())
        .set(Authorization)
        .send(createBody)
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          chai
            .request(app)
            .put(endpoints.updateConsent())
            .set(Authorization)
            .send(updateBody)
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
              setTimeout(() => {
                chai
                  .request(app)
                  .post(endpoints.resetConsent())
                  .set({ "X-Auth-Header": "12345678", "X-App-Id": app_id })
                  .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    chai
                      .request(app)
                      .get(
                        `${endpoints.skipConsent(
                          subscriber_id,
                          app_id
                        )}?scopes=${scopes.join(" ")}`
                      )
                      .set(Authorization)
                      .end((err, res) => {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.status).to.equal(false);
                        done();
                      });
                  });
              }, 500);
            });
        });
    }, 500);
  });
});
