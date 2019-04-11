const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);
const AUTH_CLIENT_ID = 'authjshdkjhas8sdandsakdadkad23';
const AUTH_CLIENT_SECRET = 'secretmessageauthhgjgdsadb4343';
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET);
const endpoints = {
  generate: "/auth/v1/generate/totp",
  verify: "/auth/v1/verify/totp",
  verifyUser: "/auth/v1/verify/user"
};

describe("Testing Verify User Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    it("Should return 200/204 for POST", done => {
      let body = {
        msisdn: "639234500095"
      };
      chai
        .request(app)
        .post(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          console.log("********", res);
          expect(res.status).to.be.oneOf([200, 204]);
          done();
        });
    });
    it("Should return 404 for PUT", done => {
      let body = {
        msisdn: "639234500095",
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD"
      };
      chai
        .request(app)
        .put(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for PATCH", done => {
      let body = {
        msisdn: "639234500095",
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD"
      };
      chai
        .request(app)
        .patch(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for GET", done => {
      chai
        .request(app)
        .get(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return 404 for DELETE", done => {
      let body = {
        msisdn: "639234500095",
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD"
      };
      chai
        .request(app)
        .delete(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("Testing Bad Parameter Responses", () => {
    it("Should return 400 if MSISDN and Subscriber ID is passed together", done => {
      let body = {
        msisdn: "639234500095",
        subscriber_id: "akjdfkjahfaiufyaiqreiqwuy398472"
      };
      chai
        .request(app)
        .post(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("Should return 400 if MSISDN and Subscriber ID are NOT passed", done => {
      let body = {};
      chai
        .request(app)
        .post(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe("Testing Verify User", () => {
    it("Should return 200/201 for a successful response", done => {
      let body = {
        msisdn: "639234500095"
      };
      chai
        .request(app)
        .post(endpoints.verifyUser)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200, 204]);
          done();
        });
    });
  });
});
