const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);
const CONSENT_CLIENT_ID = 'consentjshdkjhas8sdandsakdadkad23';
const CONSENT_CLIENT_SECRET = 'secretmessageconsenthgjgdsadb4343';
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(CONSENT_CLIENT_ID, CONSENT_CLIENT_SECRET);
const endpoints = {
  skipConsent: "/subscriber/v1/app/consent_bypass"
};

describe("Testing the Consent Skip Endpoint", () => {
  describe("Testing HTTP Methods", () => {
    //request timeout code is handled for uuid and appid but sending all the parameters in the request
    it("Should return 200 for GET", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .get(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .then(res => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it("Should return 404 for POST", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .post(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .send({})
        .then(res => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for PATCH", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .patch(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .send({})
        .then(res => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for DELETE", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .del(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .send({})
        .then(res => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for PUT", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .put(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .send({})
        .then(res => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
 
  describe("Testing Consent Skip", () => {
    it("Should return 200 and with body TRUE if consent found", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%2C%22SUBSCRIBER%22%5D"
      };

      chai
        .request(app)
        .get(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.equal(true);
          done();
        });
    });
    it("Should return 200 and with body FALSE if consent not found", done => {
      let data = {
        uuid: "312a1b11bef6a824a43419bd94723520",
        app_id: "b9a49cdb-d43d-42c7-bb82-a2ce0782c251",
        developer_id: "globeslingshot@@@10b28aac-1d95-43bf-8347-fa97e9851497",
        access_token: "99lFWCkGARqxA3BnLMOE933SC1rR",
        scopes: "%5B%22CONTACT%22%2C%22LOCATION%22%5D"
      };

      chai
        .request(app)
        .get(
          `${endpoints.skipConsent}/${data.uuid}/${data.app_id}/${
            data.developer_id
          }/${data.access_token}/${data.scopes}`
        )
        .set({'Authorization': token})
        .type("application/json")
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.equal(false);
          done();
        });
    });
  });
});
