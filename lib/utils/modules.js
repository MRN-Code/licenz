/**
 * @module lib/utils/modules
 */

'use strict';

var assign = require('lodash.assign');
var semver = require('semver');

/**
 * Hard-coded modules whitelist.
 *
 * @example
 * <caption>Use with semver-compatible versions or ranges, like in package.json</caption>
 * {
 *   'my-module': '^2.3.0',
 *   'my-other-module': '0.5.2',
 *   'my-best-module': '~8.0.0'
 * }
 *
 * @type {object}
 */
var MODULES_WHITELIST = {};

/**
 * User-added modules whitelist.
 *
 * These are kept separate mostly for the sake of testing.
 *
 * @see module:lib/utils/modules#whitelist
 *
 * @type {object}
 */
var userWhitelist = {};

/**
 * Check if module is permitted.
 *
 * @method module:lib/utils/modules#isPermitted
 *
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
 * Add user's module(s) to whitelist.
 *
 * @method module:lib/utils/modules#whitelist
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
 * Clear user's whitelisted modules.
 *
 * @method module:lib/utils/modules#_clearUserWhitelist
 */
function clearUserWhitelist() {
    userWhitelist = {};
}

module.exports = {
    _clearUserWhitelist: clearUserWhitelist,
    isPermitted: isPermitted,
    whitelist: whitelist,
};
