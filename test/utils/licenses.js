/* eslint-disable no-var,object-shorthand,prefer-arrow-callback,prefer-template */

'use strict';

var licenses = require('../../lib/utils/licenses.js');
var test = require('tape');

test('License whitelisting', function licenceWhitelisting(t) {
  var license = 'Most Rad OSS License';

  t.notOk(licenses.isPermitted(license), 'New license isn’t permitted');
  licenses.whitelist(license);
  t.ok(licenses.isPermitted(license), 'Add new license to whitelist');
  licenses._clearUserWhitelist(); // Clean up

  t.end();
});
