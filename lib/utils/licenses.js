/* eslint-disable no-var,object-shorthand,prefer-arrow-callback,prefer-template */

/**
 * @module lib/utils/licenses
 */

'use strict';

/**
 * Hard-coded licenses whitelist.
 *
 * Make sure these are lower case!
 *
 * @type {string[]}
 */
var LICENSES_WHITELIST = [
  '(bsd-2-clause or mit or apache-2.0)',
  '(bsd-2-clause or mit)',
  '(mit and cc-by-3.0)',
  'apache 2',
  'apache 2.0',
  'apache',
  'apache-2.0',
  'apache2',
  'artistic-2.0',
  'bsd',
  'bsd-2-clause',
  'bsd-3-clause and mit',
  'bsd-3-clause',
  'bsd-4-clause',
  'cc-by-3.0',
  'cc-by-4.0',
  'cc0-1.0',
  'freebsd',
  'gpl',
  'isc',
  'lgpl',
  'mit license',
  'mit',
  'mit/x11',
  'public domain',
  'unlicense',
  'wtfpl',
];

/**
 * User-added licenses whitelist.
 *
 * These are kept separate mostly for the sake of testing.
 *
 * @see module:lib/utils/licenses#whitelist
 *
 * @type {string[]}
 */
var userWhitelist = [];

/**
 * Check if license is permitted.
 *
 * @method module:lib/utils/licenses#isPermitted
 *
 * @param {(string|string[])} license
 * @returns {boolean}
 */
function isPermitted(license) {
  if (Array.isArray(license)) {
    return license.every(isPermitted);
  }

  /* eslint-disable no-param-reassign */
  license = license.toLowerCase(); // Normalize
  /* eslint-enable no-param-reassign */

  return !(
    LICENSES_WHITELIST.indexOf(license) === -1 &&
    userWhitelist.indexOf(license) === -1
  );
}

/**
 * Add user's license(s) to whitelist.
 *
 * @method module:lib/utils/licenses#whitelist
 *
 * @param {string|string[]} license
 * @returns {undefined}
 */
function whitelist(license) {
  if (typeof license === 'string') {
    license = [license]; // eslint-disable-line no-param-reassign
  }

  [].push.apply(userWhitelist, license.map(function lowercaseLicense(l) {
    return l.toLowerCase();
  }));
}

/**
 * Clear user's whitelisted licenses.
 *
 * @method module:lib/utils/licenses#_clearUserWhitelist
 */
function clearUserWhitelist() {
  userWhitelist = [];
}

module.exports = {
  _clearUserWhitelist: clearUserWhitelist,
  isPermitted: isPermitted,
  whitelist: whitelist,
};
