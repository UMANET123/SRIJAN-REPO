/**
 * Update and Return back mobile number
 * with Area Code
 * @param {string} msisdn Mobile Number
 * @returns {string} Updated Mobile Number
 */
function updateMobileNumber(msisdn) {
  if (msisdn.startsWith("+63")) return msisdn;
  if (msisdn.startsWith("63")) return `+${msisdn}`;
  //  remove 0 from mobile number if it is in the first character
  if (msisdn.startsWith("0"))  msisdn = msisdn.slice(1);
  return `+63${msisdn}`;
}

module.exports = updateMobileNumber;
