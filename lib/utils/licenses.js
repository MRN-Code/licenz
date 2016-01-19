'use strict';

/**
 * Hard-coded licenses whitelist
 *
 * Make sure these are lower case!
 *
 * @type {string[]}
 */
var LICENSES_WHITELIST = [
    'apache',
    'bsd',
    'mit',
];

var userWhitelist = [];

/**
 * @param {string} license
 * @returns {boolean}
 */
function isPermitted(license) {
    license = license.toLowerCase(); // Normalize

    return !(
        LICENSES_WHITELIST.indexOf(license) === -1 &&
        userWhitelist.indexOf(license) === -1
    );
}

/**
 * Whitelist license(s).
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
 * @returns {undefined}
 */
function clearUserWhitelist() {
    userWhitelist = [];
}

module.exports = {
    _clearUserWhitelist: clearUserWhitelist,
    isPermitted: isPermitted,
    whitelist: whitelist,
};
