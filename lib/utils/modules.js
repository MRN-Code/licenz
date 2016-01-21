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
var MODULES_WHITELIST = {
    'ansi': '^0.3.0',
    'array-index': '^0.1.1',
    'assert-plus': '^0.1.5',
    'babel': '^5.0.0',
    'cli-table': '^0.3.1',
    'commander': '>=0.6.1',
    'css': '^1.0.8',
    'css-parse': '^1.0.4',
    'css-stringify': '^1.0.5',
    'cycle': '^1.0.0',
    'dateformat': '1.0.2-1.2.3',
    'debug': '>=0.7.4',
    'entities': '^1.0.0',
    'esmangle-evaluator': '^1.0.0',
    'fakeredis': '^0.3.2',
    'flatten': '^0.0.1',
    'fs.extra': '^1.3.2',
    'github-releases': '^0.6.6',
    'growl': '^1.8.1',
    'indexof': '^0.0.1',
    'jshint': '^2.0.0',
    'json-schema': '^0.2.0',
    'ms': '^0.6.2',
    'options': '^0.0.6',
    'progress': '^1.1.2',
    'qs': '^0.6.6',
    'redis': '^0.12.1',
    'ripemd160': '^0.2.0',
    'rx-lite': '^3.1.2',
    'single-line-log': '^0.4.1',
    'ua-parser-js': '^0.7.10',
    'uglify-js': '>=1.2.3',
    'vow-fs': '^0.3.4',
    'weak-map': '^1.0.0',
};

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
        throw new Error('Invalid version ' + name + ': ' + version);
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
