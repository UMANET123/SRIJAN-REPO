/**
 *
 *
 * @param {Date} date  Date Object
 * @param {number} minutes Minute in numbers
 * @returns {Date} Date Object
 * Function will add minutes to passed Date and
 * Return back
 */
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

module.exports = AddMinutesToDate;
