'use strict';

var licenseChecker = require('license-checker');
var licenses = require('./utils/licenses.js');
var modules = require('./utils/modules.js');
var noop = require('lodash.noop');

/**
 * Map license-checker result.
 *
 * @param {string} key <name>@<version>
 * @param {object} data
 * @returns {object}
 */
function mapLicenseCheckerResult(key, data) {
    var keyPieces = key.split('@');
    var licenses = data.licenses;

    if (keyPieces.length < 2) {
        throw new Error(
            'Key doesn\'t match expected <name>@<version> format: ' + key
        );
    }

    /**
     * license-checker appends '*' to licenses when it's making assumptions
     * based on string comparisions. We'll accept the assumptions as valid
     * licenses.
     */
    if (licenses.slice(-1) === '*') {
        licenses = licenses.slice(0, licenses.length - 1);
    }

    return {
        licenses: licenses,
        licenseFile: data.licenseFile,
        name: keyPieces[0],
        repository: data.repository,
        version: keyPieces[1],
    };
}

/**
 * Check.
 * @module
 *
 * {@link https://github.com/davglass/license-checker#requiring}
 *
 * @param {object} options
 * @param {string} [options.path=process.cwd()] Path to begin license search. It should _package.json_ and _node_modules_. Defaults to the current directory.
 * @param {array} [options.whitelistLicenses]
 * @param {object} [options.whitelistModules]
 * @param {checkCallback} [callback=noop] Callback fired after all licenses have been scanned.
 * @return {Promise}
 */
function check(options, callback) {
    callback = callback instanceof Function ? callback : noop;

    var path = options.path || process.cwd();
    var whitelistLicenses = options.whitelistLicenses;
    var whitelistModules = options.whitelistModules;

    if (whitelistModules) {
        modules.whitelist(whitelistModules);
    }
    if (whitelistLicenses) {
        licenses.whitelist(whitelistLicenses);
    }

    return new Promise(function(resolve, reject) {
        licenseChecker.init({
            start: path,
        }, function(json, err) {
            if (err) {
                callback(err);
                reject(err);
                return;
            }

            var results = Object.keys(json)
                .map(function(key) {
                    return mapLicenseCheckerResult(key, json[key]);
                })
                .filter(function(module) {
                    return !(
                        licenses.isPermitted(module.licenses) ||
                        modules.isPermitted(module.name, module.version)
                    );
                });

            callback(null, results);
            resolve(results);
        });
    });
}

/**
 * @callback checkCallback
 * @param {Error} err
 * @param {array} res
 */

module.exports = check;
