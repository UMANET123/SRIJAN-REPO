const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);
const AUTH_CLIENT_ID = 'authjshdkjhas8sdandsakdadkad23';
const AUTH_CLIENT_SECRET = 'secretmessageauthhgjgdsadb4343';
const { getAuthorizationHeader } = require("../helpers/authorization");
const token = getAuthorizationHeader(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET);
const endpoint = "/auth/v1/transaction";
let body = { sampledata: "" };
describe("Testing GET Transaction Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    //    first need to create a transaction
    it("Should return 200 with specific Attributes for the GET transaction Request", done => {
      let createTransactionPayload = {
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoint)
        .set({'Authorization': token})
        .type("application/json")
        .send(JSON.stringify(createTransactionPayload))
        .end((err, res) => {
          let { transaction_id } = res.body;
          if (transaction_id) {
            chai
              .request(app)
              .get(endpoint + `/${transaction_id}`)
              .set({'Authorization': token})
              .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.be.an("object");
                expect(res.body).to.have.all.keys(
                  "response_type",
                  "client_id",
                  "redirect_uri",
                  "scopes",
                  "state",
                  "auth_state",
                  "subscriber_id",
                  "app_id",
                  "developer_id"
                );
                done();
              });
          }
        });
    });
    it("Should return 401  for invalid transaction ID", done => {
      chai
        .request(app)
        .get(endpoint + "/abcdsdsdse")
        .set({'Authorization': token})
        .end((err, res) => {
          expect(res.status).to.equal(401);
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
  });
  //   describe("Testing Response Parameter for Create Transaction with scopes only in Request", () => {
  //     it("Should Return transaction Id in the response", done => {
  //       let body = {
  //         scopes: ["scope1", "scope2", "scope3"]
  //       };
  //       chai
  //         .request(app)
  //         .post(endpoint)
  //         .set({'Authorization': token})
  //         .type("application/json")
  //         .send(JSON.stringify(body))
  //         .end((err, res) => {
  //           expect(res.body).to.be.an("object");
  //           expect(res.body).to.have.property("transaction_id");
  //           expect(res.body.transaction_id).to.be.a("string");
  //           done();
  //         });
  //     });
  //   });
});
