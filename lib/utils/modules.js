'use strict';

var assign = require('lodash.assign');
var semver = require('semver');

var MODULES_WHITELIST = {};

var userWhitelist = {};

/**
 * @param {string} name Module's name
 * @param {string} version Module's semver version
 * @returns {boolean}
 */
function isPermitted(name, version) {
    var whitelist = assign({}, MODULES_WHITELIST, userWhitelist);
    var target;

    if (!semver.valid(version)) {
        throw new Error('Invalid version: ' + version);
    }

    if (Object.keys(whitelist).indexOf(name) !== -1) {
        target = whitelist[name];

        if (semver.valid(target)) {
            return semver.gte(version, target);
        } else if (semver.validRange(target)) {
            return semver.satisfies(version, target);
        } else {
            throw new Error(
                'Invalid range or version for ' + name + ': ' + target
            );
        }
    }

    return false;
}

/**
 * Whitelist module(s).
 *
 * @example
 * whitelist({
 *   'module-1': '0.1.0',
 *   'my-module-2': '1.0.0',
 * })
 *
 * @param {object} modules name-version hash of modules to whitelist
 * @returns {undefined}
 */
function whitelist(modules) {
    Object.keys(modules).forEach(function(name) {
        userWhitelist[name] = modules[name];
    });
}

/**
 * Clear user-added modules.
 *
 * @returns {undefined}
 */
function clearUserWhitelist() {
    userWhitelist = {};
}

module.exports = {
    _clearUserWhitelist: clearUserWhitelist,
    isPermitted: isPermitted,
    whitelist: whitelist,
};