/* eslint-disable no-var,object-shorthand,prefer-arrow-callback,prefer-template */

/**
 * @requires lib/utils/licenses
 * @requires lib/utils/modules
 */

'use strict';

var licenseChecker = require('license-checker');
var licenses = require('./utils/licenses.js');
var modules = require('./utils/modules.js');
var noop = require('lodash.noop');

/**
 * Map license-checker result.
 * @private
 *
 * @param {string} key <name>@<version>
 * @param {object} data
 * @returns {object}
 */
function mapLicenseCheckerResult(key, data) {
  var keyPieces = key.split('@');
  var licensesParam = data.licenses;

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
  if (licensesParam.slice(-1) === '*') {
    licensesParam = licensesParam.slice(0, licensesParam.length - 1);
  }

  return {
    licenses: licensesParam,
    licenseFile: data.licenseFile,
    name: keyPieces[0],
    repository: data.repository,
    version: keyPieces[1],
  };
}

/**
 * Check.
 * {@link https://github.com/davglass/license-checker#requiring}
 * @module module:licenz
 *
 * @param {object} options
 * @param {string} [options.path=process.cwd()] Path to begin license search. It
 * should _package.json_ and _node_modules_. Defaults to the current directory.
 * @param {array} [options.whitelistLicenses]
 * @param {object} [options.whitelistModules]
 * @param {checkCallback} [callback=noop] Callback fired after all licenses have
 * been scanned.
 * @return {Promise}
 */
function check(options, callback) {
  var path = options.path || process.cwd();
  var whitelistLicenses = options.whitelistLicenses;
  var whitelistModules = options.whitelistModules;

  /* eslint-disable no-param-reassign */
  callback = callback instanceof Function ? callback : noop;
  /* eslint-enable no-param-reassign */

  if (whitelistModules) {
    modules.whitelist(whitelistModules);
  }
  if (whitelistLicenses) {
    licenses.whitelist(whitelistLicenses);
  }

  return new Promise(function licenseCheckerInit(resolve, reject) {
    licenseChecker.init({
      start: path,
    }, function licenseCheckerCallback(json, err) {
      if (err) {
        callback(err);
        reject(err);
        return;
      }

      var results = Object.keys(json) // eslint-disable-line vars-on-top
        .map(function mapResult(key) {
          return mapLicenseCheckerResult(key, json[key]);
        })
        .filter(function filterModule(module) {
          // license-checker sometimes emits 'undefined' results
          if (
            module.name === 'undefined' &&
            module.version === 'undefined'
          ) {
            return; // eslint-disable-line array-callback-return
          }

          /* eslint-disable consistent-return */
          return !(
            licenses.isPermitted(module.licenses) ||
            modules.isPermitted(module.name, module.version)
          );
          /* eslint-enable consistent-return */
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
