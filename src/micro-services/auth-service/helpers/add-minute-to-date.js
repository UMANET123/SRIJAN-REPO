/**
 * Function will add minutes to passed Date and
 * Return back
 * @param {Date} date  Date Object
 * @param {number} minutes Minute in numbers
 * @returns {Date} Date Object
 */
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

module.exports = AddMinutesToDate;
