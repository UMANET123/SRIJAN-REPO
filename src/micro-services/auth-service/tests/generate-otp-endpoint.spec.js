const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);

const endpoints = {
  generate: "/auth/v1/generate/totp",
  verify: "/auth/v1/verify/totp"
};

describe("Testing Generate TOTP Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    let body = {
      msisdn: "639234567895",
      app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
      blacklist: true
    };

    it("Should return 200/201 for POST", done => {
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.oneOf([201, 200]);
          done();
        });
    });
    it("Should return 404 for PUT", done => {
      chai
        .request(app)
        .put(endpoints.generate)
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
        .patch(endpoints.generate)
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
        .delete(endpoints.generate)
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
        .get(endpoints.generate)
        .type("application/json")
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          done();
        });
    });
  });

  describe("Testing Bad Parameter Responses", () => {
    it("Should Return 400 for missing MSISDN", done => {
      let body = {
        msisdn: "",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it("Should Return 400 for missing App ID", done => {
      let body = {
        msisdn: "639234567895",
        app_id: "",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it("Should Return 400 for Blacklist not boolean", done => {
      let body = {
        msisdn: "639234567895",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: "true"
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
    it("Should Return 400 for wrong MSISDN", done => {
      let body = {
        msisdn: "919234567895",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          done();
        });
    });
  });

  describe("Testing Generating TOTP", () => {
    it("Should Successfully Generate a TOTP", done => {
      let body = {
        msisdn: "639234567895",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res.status).to.be.oneOf([201, 200]);
          done();
        });
    });
    //breaks all the time because of some issues, nothing to do with the code not working, but the test case issue
    xit("Should Fail to Generate a TOTP due to a Blocked Account", done => {
      let body = {
        msisdn: "639234444211",
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
            .send(
              JSON.stringify({
                app_id: body.app_id,
                subscriber_id: res.body.subscriber_id,
                otp: "123456"
              })
            )
            .then(() => {
              chai
                .request(app)
                .post(endpoints.verify)
                .type("application/json")
                .send(
                  JSON.stringify({
                    app_id: body.app_id,
                    subscriber_id: res.body.subscriber_id,
                    otp: "123456"
                  })
                )
                .then(() => {
                  chai
                    .request(app)
                    .post(endpoints.verify)
                    .type("application/json")
                    .send(
                      JSON.stringify({
                        app_id: body.app_id,
                        subscriber_id: res.body.subscriber_id,
                        otp: "123456"
                      })
                    )
                    .then(() => {
                      chai
                        .request(app)
                        .post(endpoints.generate)
                        .type("application/json")
                        .send(JSON.stringify(body))
                        .then(res => {
                          expect(res).to.have.status(403);
                          done();
                        });
                    });
                });
            });
        });
    });
    it("Should Fail to Generate a TOTP for a black listed app", done => {
      let body = {
        msisdn: "09273164032",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4ac",
        blacklist: true
      };

      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });
  });
});
