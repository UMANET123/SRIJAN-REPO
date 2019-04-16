const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);
const {
  AUTH_KEYS: { auth_client_id, auth_secret_message }
} = require("../config/environment");
const AUTH_CLIENT_ID = auth_client_id;
const AUTH_CLIENT_SECRET = auth_secret_message;
const endpoint = "/auth/v1/transaction";
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET);

describe("Testing Create Transaction Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    let body = {
      app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
    };

    it("Should return 201 for POST", done => {
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
    it("Should return 404 for PUT", done => {
      chai
        .request(app)
        .put(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for PATCH", done => {
      chai
        .request(app)
        .patch(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for DELETE", done => {
      chai
        .request(app)
        .delete(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for GET", done => {
      chai
        .request(app)
        .get(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe("Testing Response Parameter for Create Transaction", () => {
    it("Should Return transaction Id in the response", done => {
      let body = {
        response_type: "sample_type",
        client_id: "e2274bcab5aa452c7ae03165",
        redirect_uri: "url",
        scopes: ["scope1", "scope2", "scope3"],
        state: "string_value",
        auth_state: 0,
        app_id: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
        developer_id: "j33ufh8hifjijdfdtgPN"
      };
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("transaction_id");
          expect(res.body.transaction_id).to.be.a("string");
          done();
        });
    });
  });
  describe("Testing Response Parameter for Create Transaction with scopes only in Request", () => {
    it("Should Return transaction Id in the response", done => {
      let body = {
        scopes: ["scope1", "scope2", "scope3"]
      };
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("transaction_id");
          expect(res.body.transaction_id).to.be.a("string");
          done();
        });
    });
  });
});
