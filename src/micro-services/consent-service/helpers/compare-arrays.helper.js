/**
 *
 *
 * @param {array} array1
 * @param {array} array2
 * @returns {boolean}
 * Checks 2 array contain same items
 * and return true/false
 */
function arraysHaveSameItems(array1, array2) {
  array1 = array1.sort();
  array2 = array2.sort();
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value == array2[index])
  );
}

module.exports = arraysHaveSameItems;
