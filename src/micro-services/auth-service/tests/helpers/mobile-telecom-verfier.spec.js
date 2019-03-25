let mobileNumberCheck = require("../../helpers/subscriber");
let chai = require("chai");

describe("Testing the PH Mobile Number Parser Js File", () => {
  it("Should return true for a PH number", done => {
    let mobileNumber = "9509806210";
    let mobileNumberValidity = mobileNumberCheck.getTelco(mobileNumber);
    chai.expect(mobileNumberValidity.valid).to.equal(true);
    done();
  });
  it("Should return false for a NON PH number", done => {
    let mobileNumber = "7020972580";
    let mobileNumberValidity = mobileNumberCheck.getTelco(mobileNumber);
    chai.expect(mobileNumberValidity.valid).to.equal(false);
    done();
  });
  it("Should return true if telecom provider is Globe Prepaid", done => {
    let mobileNumber = "9269745632";
    chai.expect(mobileNumberCheck.isGlobe(mobileNumber)).to.equal(true);
    done();
  });
  it("Should return true if telecom provider is Globe Postpaid", done => {
    let mobileNumber = "9173045632";
    chai.expect(mobileNumberCheck.isGlobePostpaid(mobileNumber)).to.equal(true);
    done();
  });
  it("Should return true if telecom provider is Smart", done => {
    let mobileNumber = "9083045632";
    chai.expect(mobileNumberCheck.isSmart(mobileNumber)).to.equal(true);
    done();
  });
  it("Should return true if telecom provider is Sun", done => {
    let mobileNumber = "9323045632";
    chai.expect(mobileNumberCheck.isSun(mobileNumber)).to.equal(true);
    done();
  });
});
