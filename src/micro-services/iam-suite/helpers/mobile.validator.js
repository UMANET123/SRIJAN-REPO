module.exports = function (mobileNumber) {
    let pattern = /^639[0-9]{9}$/;
    return pattern.test(mobileNumber);
}