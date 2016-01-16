'use strict';

var licenseChecker = require('license-checker');
var noop = require('lodash.noop');

/**
 * Check.
 * @module
 *
 * {@link https://github.com/davglass/license-checker#requiring}
 *
 * @param {object} options
 * @param {string} [options.path=process.cwd()]
 * @param {object} [options.licenses]
 * @param {array} [options.hi]
 * @param {function} [callback=noop]
 * @return {Promise}
 */
function check(options, callback) {
    callback = callback instanceof Function ? callback : noop;

    var path = options.path || process.cwd();

    return new Promise(function(resolve, reject) {
        licenseChecker.init({
            onlyunknown: true,
            start: path,
        }, function(json, err) {
            if (err) {
                callback(err);
                reject(err);
                return;
            }

            callback(null, json);
            resolve(json);
        });
    });
}

module.exports = check;
