const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);

const endpoints = {
  generate: "/auth/v1/generate/totp",
  verify: "/auth/v1/verify/totp",
  validate: "/auth/v1/transaction",
  invalidate: "invalidate"
};

describe("Testing Validate Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    it("Should return 200/201 for GET", done => {
      let body = {
        msisdn: "639234423210",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .then(res => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(res.body)
            .then(value => {
              chai
                .request(app)
                .get(
                  `${endpoints.validate}/${value.body.transaction_id}/${
                    res.body.subscriber_id
                  }/${res.body.app_id}`
                )
                .then(res => {
                  console.log(res.body);
                  expect(res).to.have.status(200);
                  done();
                });
            });
        });
    });
    it("Should return 404 for PUT", done => {
      chai
        .request(app)
        .put(endpoints.validate)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for PATCH", done => {
      chai
        .request(app)
        .patch(endpoints.validate)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for DELETE", done => {
      chai
        .request(app)
        .delete(endpoints.validate)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
    it("Should return 404 for POST", done => {
      chai
        .request(app)
        .post(endpoints.validate)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });
  describe("Should Test Validate Endpoint", () => {
    it("Should Return 200 with isValid true", done => {
      let body = {
        msisdn: "639234923990",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .then(res => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(res.body)
            .then(value => {
              chai
                .request(app)
                .get(
                  `${endpoints.validate}/${value.body.transaction_id}/${
                    res.body.subscriber_id
                  }/${res.body.app_id}`
                )
                .then(res => {
                  console.log(res.body);
                  expect(res).to.have.status(200);
                  expect(res.body.is_valid).to.be.equal(true);
                  done();
                });
            });
        });
    });
    it("Should Return 200 with isValid false", done => {
      let body = {
        msisdn: "639234923990",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .then(res => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(res.body)
            .then(value => {
                console.log("*** IN INVALIDATE TEST : ",res.body)
              chai
                .request(app)
                .put(
                  `${endpoints.validate}/${value.body.transaction_id}/${
                    endpoints.invalidate
                  }`
                )
                .send(
                  res.body
                )
                .then(() => {
                  chai
                    .request(app)
                    .get(
                      `${endpoints.validate}/${value.body.transaction_id}/${
                        res.body.subscriber_id
                      }/${res.body.app_id}`
                    )
                    .then(data => {
                        console.log(data)
                      console.log(data.body);
                      expect(data).to.have.status(200);
                      expect(data.body.is_valid).to.equal(false)
                      done();
                    });
                });
            });
        });
    });
  });
});
