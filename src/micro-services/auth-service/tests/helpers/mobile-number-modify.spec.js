let MobileNumberModify = require('../../helpers/mobile-number.modify');
let chai = require('chai');

describe('Testing Mobile Number Modify',()=>{
    it('Should return number with +63 if + not present',(done)=>{
        let number = "639509806210";
        let modifiedNumber = MobileNumberModify(number);
        chai.expect(`+${number}`).equal(modifiedNumber);
        done();
    });

    it('Should return number as, when +63 is present',(done)=>{
        let number = "+639509806210";
        let modifiedNumber = MobileNumberModify(number);
        chai.expect(number).equal(modifiedNumber);
        done();
    })

    it('Should return +63 number, when +63 or 63 is not present',(done)=>{
        let number = "9509806210";
        let modifiedNumber = MobileNumberModify(number);
        chai.expect(`+63${number}`).equal(modifiedNumber);
        done();
    })
     it('Should ignore 0 ,return +63 number when number starts with 0',(done)=>{
        let number = "09509806210";
        let modifiedNumber = MobileNumberModify(number);
        chai.expect(`+63${number.slice(1)}`).equal(modifiedNumber);
        done();
    })
});