const compareArrays = require("../helpers/compare-arrays.helper");

const { expect, should } = require("chai");

describe(`Testing Compare 2 arrays contains same elements return boolean`, () => {
  it(`Should Return true for same arrays`, () => {
    let array1 = [1, 3, 6];
    let array2 = [1, 6, 3];
    expect(compareArrays(array1, array2)).to.be.true;
  });
  it(`Should Return false for different arrays`, () => {
    let array1 = [1, 3, 6];
    let array2 = [1, 6, 3, 6, 7, 45];
    expect(compareArrays(array1, array2)).to.be.false;
  });
  it(`Should Return true for same content as string`, () => {
    let array1 = [1, 3, 6];
    let array2 = ["1", 6, "3"];
    expect(compareArrays(array1, array2)).to.be.true;
  });
});
