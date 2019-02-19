var SubscriberNumber = {};

SubscriberNumber.mobileFormat = /^(?:tel:\+)?\+?(63|0)?(9\d{2})(\d{7})$/;

/**
 * Parses the msisdn and returns an object or
 * null if invalid
 *
 * @param {string} number
 * @returns {object|null}
 */
SubscriberNumber.parseNumber = function(number) {
  number = String(number);
  // remove dashes and spaces
  number = number.replace(/\s|-/g, "");
  number = this.mobileFormat.exec(number);
  if(number) {
    return {
      countryCode: number[1],
      nationalDestinationCode: number[2],
      subscriberNumber: number[3],
      msisdn: number[1] + number[2] + number[3],
      baseNumber: number[2] + number[3],
      internationalNumber: '63' + number[2] + number[3]
    };
  }
  return null;
};

/**
 * Parses and returns the base number of the
 * msisdn 9xxxxxxxxx format
 *
 * @param {string} number
 * @returns {string|null}
 */
SubscriberNumber.getBaseNumber = function(number) {
  number = this.parseNumber(number);
  return number ? number.baseNumber : null;
};

/**
 * Returns the msisdn in international format
 * +639xxxxxxxxx
 *
 * @param {string} number
 * @returns {string|null}
 */
SubscriberNumber.internationalCodeNumber = function(number) {
    number = this.parseNumber(number);
    return number ? number.internationalNumber : null;
};

/**
 * Parses and returns the telco of the number
 *
 * @param {string} number - the number to be parsed
 * @param {object} options
 * @param {boolean} options.international - formats the address in
 *                  international (with country code) format
 * @returns {object} obj
 * @returns {string|null} obj.address - the number in either
 *                        the base format or international format
 * @returns {string|null} obj.telco - which telco the number belongs
 * @returns {boolean} obj.chikka - if the number is sendable through chikka
 * @returns {boolean} obj.ipp - if the number is sendable through smsc
 * @returns {boolean} obj.valid - if the number is valid
 *
 */
SubscriberNumber.getTelco = function(number, options) {
  var telco;
  options = options || {};

  var parsedNumber = this.parseNumber(number);

  var o = {
    address: null,
    chikka: false,
    ipp: false,
    telco: null,
    valid: true
  };

  if(!parsedNumber) {
    o.address = number;
    o.valid = false;
    return o;
  }

  var address = options.international ? parsedNumber.internationalNumber : parsedNumber.baseNumber;

  o.address = address;

  if(this.isGlobe(address)) {
    o.telco = 'globe';
    o.ipp = true;
  }
  else if(this.isSmart(address)) {
    o.telco = 'smart';
    o.chikka = true;
  }
  else if(this.isSun(address)) {
    o.telco = 'sun';
    o.chikka = true;
  }
  else {
    o.valid = false;
  }

  return o;
};

SubscriberNumber.globePrefixes = [
    '905',
    '906',
    '915',
    '916',
    '917',
    '926',
    '927',
    '935',
    '936',
    '937',
    '945',
    '952', // new
    '953', // new
    '954', // new
    '955',
    '956',
    '957',
    '959', // new
    '965',
    '966',
    '967',
    '971', // new
    '972', // new
    '975',
    '976',
    '977',
    '978',
    '979', // Bell Telecom
    '980', // new
    '983', // new
    '986', // new
    '987', // new
    '989', // new
    '994', // removed - retained
    '995',
    '996',
    '997',
];

SubscriberNumber.sunPrefixes = [
    '922',
    '923',
    '924', // removed - retained
    '925',
    '931',
    '932',
    '933',
    '934', // removed - retained
    '942',
    '943',
    '944', // removed - retained
];

SubscriberNumber.smartPrefixes = [
    '900', // removed - retained
    '907',
    '908',
    '909',
    '910',
    '911', // removed - retained
    '912',
    '913', // bayantel
    '914', // bayantel
    '918',
    '919',
    '920',
    '921',
    '928',
    '929',
    '930',
    '938',
    '939',
    '940', // removed - retained
    '946',
    '947',
    '948',
    '949',
    '950',
    '951', // new
    '958', // new
    '960', // new
    '961', // new
    '962',
    '963', // new
    '964', // new
    '968', // new
    '969', // new
    '970', // new
    '981', // new
    '982', // new
    '984', // new
    '985', // new
    '988', // new
    // '989', // moved to globe
    '990', // removed - retained
    '998',
    '999',
];

SubscriberNumber.globePostpaidPrefixes = [
    '90598',
    '90599',
    '91730',
    '91731',
    '91732',
    '91750',
    '91751',
    '91752',
    '91753',
    '91754',
    '91755',
    '91756',
    '91757',
    '91758',
    '91759',
    '91762',
    '91763',
    '91765',
    '91767',
    '91768',
    '91770',
    '91771',
    '91772',
    '91777',
    '91779',
    '91780',
    '91781',
    '91782',
    '91783',
    '91784',
    '91785',
    '91786',
    '91787',
    '91788',
    '91789',
    '93730',
    '93731',
    '93732',
    '93733',
    '93734',
    '93735',
    '93736',
    '93737',
    '93738',
    '93739',
    '9378',
    '97599',
    '97699',
    '97799',
];

SubscriberNumber. _validatePrefix = function(prefix, number) {
    number = this.parseNumber(number);
    if(!number) { return false; }
    return prefix.indexOf(number.nationalDestinationCode) !== -1 ? true : false;
};

SubscriberNumber.isGlobe =  function(number) {
    return this._validatePrefix(this.globePrefixes, number);
};

SubscriberNumber.isSmart = function(number) {
    return this._validatePrefix(this.smartPrefixes, number);
};

SubscriberNumber.isSun = function(number) {
    return this._validatePrefix(this.sunPrefixes, number);
};

SubscriberNumber.isGlobePostpaid = function(number) {
    var number = this.parseNumber(number);

    if(!number) { return false; }

    number = number.baseNumber;

    var prefixes = this.globePostpaidPrefixes;
    var length = prefixes.length;

    for (var i in prefixes){
        prefix = prefixes[i];
        if (number.indexOf(prefix) === 0){
            return true;
        }
    }

    return false;
};

module.exports = exports = SubscriberNumber;
