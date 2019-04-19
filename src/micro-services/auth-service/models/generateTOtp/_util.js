function floodControlValidity(createdDate, currentDate) {
  return Math.round((currentDate - createdDate) / 1000 / 60);
}
function getOtpMsgTemplate(otp) {
  return `${otp} is your One Time Password for Globe login.This OTP is usable only once and valid for 5 minutes from the request`;
}

module.exports = { floodControlValidity, getOtpMsgTemplate };
