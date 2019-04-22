/**
 *
 * time diffence in minutes
 * @param {Date} createdDate Date to Differentiate with
 * @param {Date} currentDate Current Date Time
 * @returns {number} Time difference in minutes
 */
function timeDifferenceInMin(createdDate, currentDate) {
  return Math.round((currentDate - createdDate) / 1000 / 60);
}
/**
 *
 *
 * @param {string} otp OTP
 * @returns {string} SMS template
 */
function getOtpMsgTemplate(otp) {
  return `${otp} is your One Time Password for Globe login.This OTP is usable only once and valid for 5 minutes from the request`;
}

module.exports = { timeDifferenceInMin, getOtpMsgTemplate };
