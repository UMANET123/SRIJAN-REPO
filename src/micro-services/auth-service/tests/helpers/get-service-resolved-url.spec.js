let getServiceResolvedUrl = require("../../helpers/get-service-resolved-url");
let chai = require("chai");

describe("Testing Get Service Resolved URL function", () => {
  describe("Happy Flow checking Testing Get Service Resolved URL function", () => {
    it("Should return a URL with http string protocol always when required parameters are passed", () => {
      getServiceResolvedUrl(
        "consentservice",
        "/subscriber/v1",
        "http://consentms:3002/subscriber/v1"
      )
        .then(url => {
          console.log("url", { url });
          chai
            .expect(url)
            .to.be.a("string")
            .and.satisfy(
              urlParam =>
                urlParam.startsWith("http://") ||
                urlParam.startsWith("https://")
            );
        })
        .catch(err => {
          console.log({ err });
        });
    });
  });
  describe("Will Fail Get Service Resolved URL function", () => {
    /*
     ,
  */
    it("Should return error  if ( serviceHost,serviceEndpointUri,serviceDefaultPath) any of ther parameters are not passed", () => {
      getServiceResolvedUrl(
        "consentservice",
        "http://consentms:3002/subscriber/v1"
      ).catch(err => {
        chai.expect(err).to.be.an("error");
      });
    });
    it("Should return error  if wrong protocolStr is passed", () => {
      getServiceResolvedUrl(
        "consentservice",
        "http://consentms:3002/subscriber/v1",
        null,
        "mshsh://"
      ).catch(err => {
        chai.expect(err).to.be.an("error");
      });
    });
  });
});
