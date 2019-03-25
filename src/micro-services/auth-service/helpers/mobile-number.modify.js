/**
 * Update and Return back mobile number
 * with Area Code
 * @param {string} msisdn Mobile Number
 * @returns {string} Updated Mobile Number
 */
function updateMobileNumber(msisdn) {
  if (msisdn.startsWith("+63")) return msisdn;
  if (msisdn.startsWith("63")) return `+${msisdn}`;
  return `+63${msisdn}`;
}

module.exports = updateMobileNumber;
