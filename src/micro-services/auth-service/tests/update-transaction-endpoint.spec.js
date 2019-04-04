const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);

const endpoint = "/auth/v1/transaction";
let body = { sampledata: "" };
let payload = {
  response_type: "sample_type2q",
  subscriber_id: "type21",
  client_id: "e2274bcab5aa452c7ae03165",
  redirect_uri: "url",
  scopes: ["scope1", "asasa"],
  state: "string_value",
  auth_state: 0,
  app_id: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
  developer_id: "j33ufh8hifjijdfdtgPN",
  status: 0
};
describe("Testing Update Transaction Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    //    first need to create a transaction
    it("Should return 200 with specific Attributes for the PUT transaction Request", done => {
      let createTransactionPayload = {
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoint)
        .type("application/json")
        .send(JSON.stringify(createTransactionPayload))
        .end((err, res) => {
          let { transaction_id } = res.body;
          if (transaction_id) {
            chai
              .request(app)
              .put(endpoint + `/${transaction_id}`)
              .type("application/json")
              .send(JSON.stringify(payload))
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
                  "app_id",
                  "developer_id"
                );
                done();
              });
          }
        });
    });
    it("Should return 200 with specific Attributes for the PATCH transaction Request", done => {
      let createTransactionPayload = {
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoint)
        .type("application/json")
        .send(JSON.stringify(createTransactionPayload))
        .end((err, res) => {
          let { transaction_id } = res.body;
          if (transaction_id) {
            chai
              .request(app)
              .patch(endpoint + `/${transaction_id}`)
              .type("application/json")
              .send(JSON.stringify(payload))
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
                  "app_id",
                  "developer_id"
                );
                done();
              });
          }
        });
    });
    it("Should return 204  for invalid transaction ID", done => {
      chai
        .request(app)
        .get(endpoint + "/abcdsdsdse")
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it("Should return 404 for DELETE", done => {
      chai
        .request(app)
        .delete(endpoint)
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
