var tk = require('timekeeper');
let AddMintuesToDate = require('../../helpers/add-minute-to-date');
var chai = require('chai');

describe('Testing Add Minute to Date',()=>{
    it('It should return the correct datetime with the added minutes',(done)=>{
        var date = new Date();
        var minutes = 10;
        tk.freeze(date)
        var newDateTime = new Date(date.getTime() + minutes * 60000)
        var testDateTime = AddMintuesToDate(date, minutes);
        chai.expect(newDateTime.toUTCString()).to.equal(testDateTime.toUTCString());
        done();
    })
})

