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
    'apache',
    'apache-2.0',
    'bsd',
    'bsd-2-clause',
    'bsd-3-clause',
    'bsd-3-clause and mit',
    'gpl',
    'isc',
    'mit',
    'mit license',
    'mit/x11',
    'public domain',
    'wtfpl'
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

    license = license.toLowerCase(); // Normalize

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
        license = [license];
    }

    [].push.apply(userWhitelist, license.map(function(l) {
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
