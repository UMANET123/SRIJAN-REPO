const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);

const endpoint = "/subscriber/v1/revoke/all";
const contentType = "application/json";

describe("Testing Update Consent API Endpoint", () => {
  describe(`Testing Response Code for ${endpoint}`, () => {
    it(`Should Return Response Code  201 or 403 for revoke single consent PUT`, done => {
      let data = JSON.stringify({
        subscriber_id: "e73216f434e325d7f687260c2c272cd6"
      });
      chai
        .request(app)
        .put(endpoint)
        .type(contentType)
        .send(data)
        .end((err, res) => {
          //   console.log({ body: res.body });
          expect(res.statusCode).to.to.be.oneOf([200, 403]);
          expect(err).to.equal(null);
          expect(res.body).to.be.an("object");
          switch (res.statusCode) {
            case 200:
              expect(res.body).to.have.property("revoked_tokens");
              expect(res.body.revoked_tokens).to.be.an("array");
              expect(res.body.revoked_tokens.length).to.be.above(0);
              break;
            case 403:
              expect(res.body).to.have.property("status", "Forbidden");
              break;
          }

          done();
        });
    });
  });

  describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
    it("Should Reject  for no subscrber_id in reqeust body with status code 400", done => {
      chai
        .request(app)
        .put(endpoint)
        .type(contentType)
        .send({})
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
});
