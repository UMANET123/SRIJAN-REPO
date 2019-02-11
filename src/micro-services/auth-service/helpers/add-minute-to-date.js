//  pass date as timestamp
//  return timestamp
module.exports = function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
