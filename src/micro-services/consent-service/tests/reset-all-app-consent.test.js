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
    return "/subscriber/v1/reset/app/all";
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

describe("Testing all apps consent reset", () => {
  it("Should test reset of all apps consent", done => {
    /**
     * This test case should do the following
     * - Create consent for multiple apps using the same subscriber id
     * - Update all the access tokens
     * - Reset Consent for App apps
     * - Check if consent skip is returning false
     */

    let scopes = ["CONTACT", "LOCATION", "SMS"];
    let subscriber_id = generateHash();
    let consent_type = "FIXED_EXPIRY";
    let date = new Date();
    date.setDate(date.getDate() + 10);
    let consent_expiry = date.toISOString();
    let app_ids = [];
    for (let i = 0; i < 3; i++) {
      app_ids.push(generateHash());
    }

    app_ids.map(app_id => {
      let transaction_id = generateHash();
      let developer_id = generateHash();
      let access_token = generateHash();
      let appname = "TEST APP";
      chai
        .request(app)
        .post(endpoints.createConsent())
        .set(Authorization)
        .send({
          subscriber_id: subscriber_id,
          app_id: app_id,
          transaction_id: transaction_id,
          developer_id: developer_id,
          scopes: scopes,
          consent_type,
          consent_expiry,
          appname
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(201);
          chai
            .request(app)
            .put(endpoints.updateConsent())
            .send({
              subscriber_id,
              transaction_id,
              app_id: app_id,
              developer_id,
              scopes,
              appname,
              access_token
            })
            .end((err, res) => {
              expect(res.statusCode).to.equal(200);
            });
        });
    });

    setTimeout(() => {
      chai
        .request(app)
        .post(endpoints.resetConsent())
        .set({ "X-Auth-Header": "123456" })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
        });
    }, 500);

    setTimeout(() => {
      app_ids.map((app_id, index) => {
        chai
          .request(app)
          .get(
            `${endpoints.skipConsent(
              subscriber_id,
              app_id
            )}?scopes=${scopes.join()}`
          )
          .set(Authorization)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.status).to.equal(false);
            if (index == app_ids.length - 1) {
              done();
            }
          });
      });
    }, 1000);
  });
});
